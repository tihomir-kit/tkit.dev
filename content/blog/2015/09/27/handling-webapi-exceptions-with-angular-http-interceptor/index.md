---
title: Handling WebAPI exceptions with Angular http interceptor
date: "2015-09-27T00:00:00.000Z"
description: How to implement a centralized place in your AngularJS app to handle all the .Net WebAPI exceptions and bad HTTP status codes that the server might return to the browser.
featuredImage: /assets/featured/angular-cogs.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/32
tags: ["dotnet", "angularjs", "exceptions", "webapi"]
---

It's good to return [meaningful HTTP status codes](https://en.wikipedia.org/wiki/List_of_HTTP_status_codes) upon server exceptions. Whether it be invalid model state, conflict upon trying to create/update an object in the database, unauthorized access or something else it adds additional value and sends a message - one that's different from generic 400's or 500's. These messages can then be used to take certain kinds of actions on the client side based on what happened.

For example you could register a custom `ApplicationExceptionHandler.cs` inside your `WebApiConfig.cs` which would then be able to catch and handle any kind of exception thrown by lower server layers (such as business layer or the DB/ORM layer):

```cs
// ApplicationExceptionHandler.cs

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.ExceptionHandling;
using System.Web.Http.Filters;

namespace MyApp.Web.Infrastructure.Filters
{
    /// <summary>
    /// Used to globally handle unhandled exceptions types.
    /// </summary>
    public class ApplicationExceptionHandler : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext context)
        {
            // used for when user is not authorized to access a WebAPI controller method
            if (context.Exception is UnauthorizedAccessException)
            {
                throw new HttpResponseException(HttpStatusCode.Unauthorized);
            }
            // used for "item with same XY (for example "name") already exists"
            else if (context.Exception is ArgumentException)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.Conflict)
                {
                    Content = new StringContent(context.Exception.Message)
                };

                throw new HttpResponseException(response);
            }
            // used for exceptions that do not make sense from the business logic point of view
            else if (context.Exception is InvalidOperationException)
            {
                HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.Conflict)
                {
                    Content = new StringContent(context.Exception.Message)
                };

                throw new HttpResponseException(response);
            }
        }
    }
}

```

You need to register ApplicationExceptionHandler in `WebApiConfig.cs` like this:

```cs
// WebApiConfig.cs

using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Microsoft.Owin.Security.OAuth;
using System.Web.Http.ExceptionHandling;
using MyApp.Web.Infrastructure.Filters;

namespace MyApp.Web
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Filters.Add(new ApplicationExceptionHandler());

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}

```

You can also use something like [ValidationFilter](/2015/09/27/handling-nets-model-state-with-validationfilter-attribute/) to take care of invalid model states in an easy way (by replying with a 422). After you have all your desired/needed exception handlers in place, it's time to setup the client side. You can easily intercept every HTTP request and act upon responses from the server with an http request interceptor that looks like this:

```js
// http-request-interceptor.factory.js

(function () {
    "use strict";

    // To regiester the interceptor, add the following line to your app.js -> .config():
    //     $httpProvider.interceptors.push("httpRequestInterceptorFactory");

    angular
        .module("MyApp.Common")
        .factory("httpRequestInterceptorFactory", HttpRequestInterceptorFactory);

    HttpRequestInterceptorFactory.$inject = ["$rootScope", "$q", "NotificationService"];
    function HttpRequestInterceptorFactory($rootScope, $q, NotificationService) {
        return {
            responseError: function (rejection) {
                // For expected errors such as failed model validation
                //simply return a promise and handle it further

                // used for when user is not authorized to access a WebAPI controller method
                if (rejection.status === 401) {
                    $rootScope.$broadcast("unauthorized-request");
                }
                // used for when the WebAPI endpoint does not exist
                else if (rejection.status === 404) {
                    $rootScope.$broadcast("error-message", { message: "Page does not exist", status: 404 });
                }
                // used for "item with same XY (for example "name") already exists"
                else if (rejection.status === 409) {
                    NotificationService.showWarning(rejection.data);
                }
                // used for invalid .net ModelState
                else if (rejection.status === 422) {
                    // invalid model states handled in controllers
                }

                //console.log(rejection);
                //console.log(rejection.data);

                if (rejection.data && rejection.data.exceptionMessage)
                    NotificationService.showWarning(rejection.data.exceptionMessage);

                return $q.reject(rejection);
            }
        };
    }
})();
```

Now you have a centralized way to handle all kinds of WebAPI errors. Simply build upon this infrastructure and add whatever else you might need. In one of the future posts I'll explain how to create basic html input element directives (for text, textarea, number, datetime and similar fields) which also seamlessly take care of modelState error messages by presenting them to the user just below the input element.