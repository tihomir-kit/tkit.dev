---
title: Enhancing RESTful WebAPI controllers with RPC style endpoints
date: "2015-05-13T00:00:00.000Z"
description: How to add extra endpoints to WebAPI controllers besides the standard ones that don't have explicit routes?
featuredImage: /assets/featured/dot-net.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/36
tags: ["dotnet", "csharp", "rest", "rpc", "webapi"]
---

During the setup stage of the new project I'm working on, the decision was made to try and use [RESTful](http://en.wikipedia.org/wiki/Representational_state_transfer) WebAPI controllers that would support [RPC](http://en.wikipedia.org/wiki/Remote_procedure_call) style endpoints as well. I did a bit of research and found a [nice post](http://carolynvanslyck.com/blog/2013/01/webapi-mixed-rest-rpc-routing/) from Carolyn Van Slyck that explains how this can be achieved by creating a few different routing rules in the `WebApiConfig` file. I wasn't however fully satisfied with this approach so I tried to do it in a different way.

If you follow .net's WebAPI conventions, you can simply write action methods that start with http verbs (GET, POST, PUT, DELETE) and everything will work out of the box with the default `WebApiConfig` setup. For example you can name your RESTful action methods something like `GetAllProducts`, `GetProduct`, `PostProduct`, etc... No extra action [route attributes](http://www.asp.net/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2) (such as `RoutePrefix`, `Route`, `HttpGet/Post/Put/Delete`) are needed for this approach. WebAPI will in this case expect the correct http verb.

However, as soon as you add a custom action, it will start causing problems (you will start getting the infamous _"Multiple actions were found that match the request"_ response). Say you add `CustomGetEndpoint` method - this will cause `GetAllProducts` and `GetProduct` to not work any more. Luckily by adding a few things we can make it work.

The first step is to enable attribute routing in your `WebApiConfig`:

```cs
// WebApiConfig.cs

public static class WebApiConfig
{
    public static void Register(HttpConfiguration config)
    {
        // Add this line to register Attribute-Routing
        config.MapHttpAttributeRoutes();

        config.Routes.MapHttpRoute(
            name: "DefaultApi",
            routeTemplate: "api/{controller}/{id}",
            defaults: new { id = RouteParameter.Optional }
        );
    }
}
```

The second step is to add the `RoutePrefix` to your controller and to add the `Route` and http verb attributes to all your custom RPC actions (they of course don't have to start with "custom" but you can name them whatever you want):

```cs
// RestVsRpc.cs

[RoutePrefix("api/products")]
public class ProductsController : ApiController
{
    // Route: GET /api/products/3
    public IHttpActionResult GetProduct(int id)
    {
        return Ok("Product " + id);
    }

    // Route: GET /api/products
    public IHttpActionResult GetAllProducts()
    {
        return Ok("All Products");
    }

    // Route: POST /api/products { id: 3 }
    public IHttpActionResult PostProduct(ProductModel model)
    {
        return Ok("Create Product " + model.Id);
    }

    // Route: PUT /api/products/3 { id: 3 }
    public IHttpActionResult PutProduct(ProductModel model)
    {
        return Ok("Update Product " + model.Id);
    }

    // Route: DELETE /api/products/3
    public IHttpActionResult DeleteProduct(int id)
    {
        return Ok("Delete Product " + id);
    }

    // Route: GET /api/products/customEndPoint?id=3
    [HttpGet]
    [Route("customGetEndpoint")]
    public IHttpActionResult CustomGetEndpoint(int id)
    {
        return Ok("Custom Get " + id);
    }

    // Route: POST /api/products/customEndPoint { id: 3 }
    [HttpPost]
    [Route("customPostEndpoint")]
    public IHttpActionResult CustomPostEndpoint(ProductModel model)
    {
        return Ok("Custom Post " + model.Id);
    }
}
```

In this case ProductModel is very simple:

```cs
// ProductModel.cs

public class ProductModel
{
    public int Id { get; set; }
}
```

Keep in mind that if you are using a `BaseApiController` class which inherits .net's `ApiController`, ensure that all your methods are `protected`. If you make your `BaseApiController` methods public, this will mess up the routing and you will start getting the _"Multiple actions were found that match the request"_ response (took me long enough to figure that one out!).

That's all folks, you can now enjoy both worlds at the same time. Enjoy!