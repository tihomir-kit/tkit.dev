---
title: Invalidating AngularJS template cache with .Net BundleConfig.cs
date: "2015-09-07T00:00:00.000Z"
description: How to invalidate cached AngularJS templates with BundleConfig.cs in .Net?
featuredImage: /assets/featured/angular-cogs.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/34
tags: [".net", "angularjs", "cache", "invalidation"]
---

You most probably had the problem with old Angular templates not clearing themselves up from the browser cache in production which can cause various problems. If you're using gulp, you can use something like [gulp-angular-templatecache](https://github.com/miickel/gulp-angular-templatecache) to tackle this problem (which would also be a preferred way of doing this) but if you're using .net's `BundleConfig.cs` to bundle your scripts, you'll have to add a bit of code to your app.

Say your app bundle section inside `BundleConfig.cs` looked something like this:

```cs
// BundleConfig.cs

bundles.Add(new ScriptBundle("~/bundles/my-app")
    .Include(// Angular dependencies
            "~/Scripts/angular/angular.js",
            "~/Scripts/angular/angular-cookies.js",
            "~/Scripts/angular/angular-ui-router.js",
            // Angular app base
            "~/app/app.js")

    .IncludeDirectory("~/app", "*.module.js", true)
    .IncludeDirectory("~/app", "*.constant.js", true)
    .IncludeDirectory("~/app", "*.factory.js", true)
    .IncludeDirectory("~/app", "*.service.js", true)
    .IncludeDirectory("~/app", "*.directive.js", true)
    .IncludeDirectory("~/app", "*.controller.js", true));

```

Then you would include that inside your index.cshtml (or some other Razor template) like this:

```html
<!-- index.cshtml -->

@section scripts
{
    @Scripts.Render("~/bundles/my-app")
}
```

And this is how the generated HTML script include tag would look in production:

```html
<script src=”/bundles/my-app?v=6XgTJerMdBNglpDE1l_sgb9JgKJDXS35tee8zasXvLk1″></script>
```

What changes upon every deploy is the "v" (version) hash at the end of bundle link. We can leverage that to keep track of the current version by extracting and storing that value within a cookie. Then on a full page reload (F5) if the version hash changed - we can simply clear the template cache and let the user continue using the app. The app will then have to re-cache all the templates once they are requested by the router or a directive.

That piece of logic can be stored inside `app.js` on `MyApp.run()`. Here is how I did it:

```js
// app.js

MyApp.run(MyAppRun);

MyAppRun.$inject = ["$cookies", "$templateCache"];
function MyAppRun($cookies, $templateCache) {
    validateAppBundleVersion();

    function getCurrentAppBundleVersion() {
        var pageScripts = $("script").toArray();
        var appBundle = _.find(pageScripts, function (pageScript) {
            return _.contains(pageScript.src, "my-app");
        });

        return appBundle ? appBundle.src.split('=')[1] : "";
    }

    // This is used to invalidate angular template cache
    function validateAppBundleVersion() {
        var currentBundleKey = getCurrentAppBundleVersion();
        if (!currentBundleKey)
            return;

        var cookieBundleKey = $cookies.get('appBundleVersion');
        if (currentBundleKey !== cookieBundleKey) {
            $templateCache.removeAll();
            $cookies.put('appBundleVersion', currentBundleKey);
        }
    }
}
```

_NOTE: I use [lodash](https://lodash.com/docs) in every project so if you're not using it, you might have to write your own code to replace `_.find()` and `_.contains()`_