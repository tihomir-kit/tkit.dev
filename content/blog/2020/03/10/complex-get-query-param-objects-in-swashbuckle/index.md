---
title: Complex GET query param objects in Swashbuckle
date: "2020-03-10T00:00:00.000Z"
description: How to bind complex objects as GET query params in Swashbuckle / Swagger in .Net Core?
featuredImage: /assets/featured/openapi.png
commentsUrl: https://github.com/pootzko/tkit.dev/issues/8
tags: [".net", "core", "webapi", "swashbuckle", "openapi"]
seoKeywords: [".net", "core", "webapi", "swagger", "swashbuckle", "openapi", "documentation"]
---

OpenAPI spec allows complex objects as query params. .Net Core also allows them.
And, they're handy in situations when you want to bundle up a few parameters into
an object that you might reuse over multiple endpoints. For example a simple
`PagedCollectionFilter` which could easily be re-used for different endpoints might
look something like this:

```cs
/// <summary>
/// Basic filter model.
/// </summary>
public class PagedCollectionFilter
{
    /// <summary>
    /// Page to fetch (optional).
    /// </summary>
    [ModelBinder(Name = "page")]
    public int? Page { get; set; }

    /// <summary>
    /// Amount of items to fetch (optional).
    /// </summary>
    [ModelBinder(Name = "pageSize")]
    public int? PageSize { get; set; }

    /// <summary>
    /// Sort by KEY (entity field name) (optional).
    /// </summary>
    [ModelBinder(Name = "sortBy")]
    public string SortBy { get; set; }

    /// <summary>
    /// Sort direction (optional).
    /// Allowed: "ascending" / "asc" / "descending" / "desc".
    /// </summary>
    [ModelBinder(Name = "sortOperator")]
    public string SortOperator { get; set; }

    /// <summary>
    /// Include deleted entities (optional)?
    /// </summary>
    [ModelBinder(Name = "includeDeleted")]
    public bool? IncludeDeleted { get; set; }
}
```

Instead of listing these few parameters as separate query params, it's much easier to just go
`Filter([FromQuery]PagedCollectionFilter filter)` instead. However, when you use this approach,
Swashbuckle will ignore the object and will spread the params as if you simply listed them
all one by one. If you want to generate some client-some code, this might not be what you want.
I don't want to specify every single param, or to even use the spread operator (`...filter`) to
accomplish this, I want to use an object.

This is what Swashbuckle will generate by default:

```json
{
  "paths": {
    "/api/v1/users/filter": {
      "get": {
        "tags": [
          "Users"
        ],
        "operationId": "FilterUsers",
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "pageSize",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          },
          {
            "name": "sortBy",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "sortOperator",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "includeDeleted",
            "in": "query",
            "schema": {
              "type": "boolean"
            }
          },
          {
            "name": "ownerId",
            "in": "query",
            "schema": {
              "type": "integer",
              "format": "int32"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserCollectionModel"
                }
              }
            }
          }
        }
      }
    }
  }
}
```

And this is what we actually want:

```json
{
  "paths": {
    "/api/v1/users/filter": {
      "get": {
        "tags": [
          "Users"
        ],
        "operationId": "FilterUsers",
        "parameters": [
          {
            "name": "filter",
            "in": "query",
            "schema": {
              "$ref": "#/components/schemas/PagedCollectionFilter"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserCollectionModel"
                }
              }
            }
          }
        }
      }
    },
  },
  "components": {
    "schemas": {
      "PagedCollectionFilter": {
        "type": "object",
        "properties": {
          "Page": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "PageSize": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          },
          "SortBy": {
            "type": "string",
            "nullable": true
          },
          "SortOperator": {
            "type": "string",
            "nullable": true
          },
          "IncludeDeleted": {
            "type": "boolean",
            "nullable": true
          },
          "OwnerId": {
            "type": "integer",
            "format": "int32",
            "nullable": true
          }
        },
        "additionalProperties": false
      }
    }
  }
}
```

I did a bit of research and tried to find a way around this issue. I found
[this](https://github.com/domaindrivendev/Swashbuckle/issues/1038) and
[this](https://github.com/domaindrivendev/Swashbuckle.AspNetCore/issues/66#issuecomment-227503817).
Neither provided me with a ready-to-use solution, but they pointed me in the right direction.

I ended up writing a custom `IOperationFilter` implementation which fixes the problem by removing the
"stand-alone" params which got created by Swashbuckle, and bundles them up in the object I expected
them to be in in the first place.

```cs
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Server.Kestrel.Core.Internal.Http;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Collections.Generic;
using System.Linq;

namespace MyApp.WebAPI.Documentation
{
    public class FromQueryModelFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            var description = context.ApiDescription;
            if (description.HttpMethod.ToLower() != HttpMethod.Get.ToString().ToLower())
            {
                // We only want to do this for GET requests, if this is not a
                // GET request, leave this operation as is, do not modify
                return;
            }

            var actionParameters = description.ActionDescriptor.Parameters;
            var apiParameters = description.ParameterDescriptions
                    .Where(p => p.Source.IsFromRequest)
                    .ToList();

            if (actionParameters.Count == apiParameters.Count)
            {
                // If no complex query parameters detected, leave this operation as is, do not modify
                return;
            }

            operation.Parameters = CreateParameters(actionParameters, operation.Parameters, context);
        }

        private IList<OpenApiParameter> CreateParameters(
            IList<ParameterDescriptor> actionParameters,
            IList<OpenApiParameter> operationParameters,
            OperationFilterContext context)
        {
            var newParameters = actionParameters
                .Select(p => CreateParameter(p, operationParameters, context))
                .Where(p => p != null)
                .ToList();

            return newParameters.Any() ? newParameters : null;
        }

        private OpenApiParameter CreateParameter(
            ParameterDescriptor actionParameter,
            IList<OpenApiParameter> operationParameters,
            OperationFilterContext context)
        {
            var operationParamNames = operationParameters.Select(p => p.Name);
            if (operationParamNames.Contains(actionParameter.Name))
            {
                // If param is defined as the action method argument, just pass it through
                return operationParameters.First(p => p.Name == actionParameter.Name);
            }

            if (actionParameter.BindingInfo == null)
            {
                return null;
            }

            var generatedSchema = context.SchemaGenerator.GenerateSchema(actionParameter.ParameterType, context.SchemaRepository);

            var newParameter = new OpenApiParameter
            {
                Name = actionParameter.Name,
                In = ParameterLocation.Query,
                Schema = generatedSchema
            };

            return newParameter;
        }
    }
}
```

To use this filter, you'll have to register this operation filter in your `.AddSwaggerGen()` like this:

```cs
public static void AddSwaggerServices(this IServiceCollection services)
{
    services.AddSwaggerGen(options =>
    {
        options.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "My API",
            Version = "v1",

        });

        // ... Whatever else you might have ...
        options.OperationFilter<FromQueryModelFilter>();
    });
}
```

If you have a better way of doing this, or have any significant improvements or potential edge-case
fixes which I haven't thought of, please leave a comment.. Thnx!