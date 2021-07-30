---
title: Handling .Net's model state with ValidationFilter attribute
date: "2015-09-27T00:00:00.000Z"
description: In this article we explore creation of a C# method attribute to process your model objects and throw and return a 422 HTTP status code if the model validation fails. DRY.
featuredImage: /assets/featured/dot-net.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/33
tags: ["dotnet", "design patterns", "model", "validation", "webapi"]
---

This is a simple ValidationFilter class which you can attach to any .net controller action method:

```cs
// ValidationFilter.cs

using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http.Filters;
using System.Web.Http.Controllers;
using System;
using System.Web.Http.ModelBinding;
using System.Collections.Generic;

namespace MyApp.Web.Infrastructure.Filters
{
    /// <summary>
    /// This action attribute is used to validate the view model. It will throw 422 - Unprocessable
    /// entity in case model (modelState) was not validated.
    /// <see href="http://stackoverflow.com/questions/11686690/handle-modelstate-validation-in-asp-net-web-api"/>
    /// <seealso href="http://stackoverflow.com/a/3291292/413785"/>
    /// </summary>
    public class ValidationFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            var modelState = actionContext.ModelState;

            var model = actionContext.ActionArguments["model"];
            if (model != null)
            {
                var modelType = model.GetType();
                dynamic modelObject = Convert.ChangeType(model, modelType);
                if (modelObject != null && modelType.GetMethod("Validate") != null)
                {
                    modelObject.Validate(modelState);
                }
            }

            if (!modelState.IsValid)
            {
                actionContext.Response = actionContext.Request.CreateErrorResponse((HttpStatusCode)422, modelState);
            }

            //base.OnActionExecuting(actionContext);
        }
    }
}
```

What it provides is a "one-line" way to handle invalid model states. For example - instead of doing [`ModelState.IsValid` check](http://www.asp.net/web-api/overview/formats-and-model-binding/model-validation-in-aspnet-web-api) on each POST/PUT action, and then handling it manually again and again (by basically copying and pasting the same chunk of code all around your controllers) you can simply reuse the `[ValidationFilter]` attribute in front of your action and it will check whether the `ModelState` is valid. If it is, the action method will execute whatever code it has inside of it, and if it's not the WebAPI will respond with a [422](http://stackoverflow.com/questions/11686690/handle-modelstate-validation-in-asp-net-web-api) (Unprocessable Entity) together with the associated `ModelState` error messages.

For example if you had this model/action combination:

```cs
// CustomerModel.cs

public class CustomerModel
{
    [Required]
    public int FirstName { get; set; }

    [Required]
    public int LastName { get; set; }
}
```

```cs
// CustomerController.cs

[ValidationFilter]
public IHttpActionResult PostCustomer(CustomerModel model)
{
    return Ok();
}
```

...and you didn't send any data to the WebAPI in your POST request, this is the 422 response that you would get back:

```js
// response.json

{
  "message": "The request is invalid.",
  "modelState": {
    "model.FirstName": [
      "The FirstName field is required."
    ],
    "model.LastName": [
      "The LastName field is required."
    ]
  }
}
```

This response can then be further parsed/handled by the client-side without problems.