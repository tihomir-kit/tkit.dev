---
title: Automatic WebAPI property casing serialization
date: "2015-04-10T00:00:00.000Z"
description: How to change JSON property serialization in .Net WebAPI to lowerCamelCase?
featuredImage: /assets/featured/dot-net-vs.png
commentsUrl: https://github.com/pootzko/tkit.dev/issues/37
tags: ["dotnet", "csharp", "javascript", "json", "serialization", "webapi"]
---

If you work a lot with WebAPI's and JavaScript and would like to follow the convention of `lowerCamelCasing` your JSON and `UpperCamelCasing` your .net model properties, you can do that by using Newtonsoft.Json `CamelCasePropertyNamesContractResolver`. This works for both directions "WebAPI -> client" and "client -> WebAPI" so that's cool as well. You should simply set this up in your Global.asax and you're good to go.

```cs
// Global.asax.cs

using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System.Web.Http;

namespace YourApp.WebAPI
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            GlobalConfiguration.Configure(WebApiConfig.Register);
            SetupJsonCasingFormatter();
        }

        private static void SetupJsonCasingFormatter()
        {
            var jsonFormatterSettings = GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings;
            jsonFormatterSettings.Formatting = Formatting.Indented;
            jsonFormatterSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
        }
    }
}
```
