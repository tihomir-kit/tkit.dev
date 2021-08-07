---
title: Pre-caching HTML templates with AngularJS ui-router directive
date: "2016-01-12T00:00:00.000Z"
description: How to pre-cache HTML templates in AngularJS to make them accessible even if the app goes offline?
featuredImage: /assets/featured/angular-cogs.jpg
commentsUrl: https://github.com/tihomir-kit/tkit.dev/issues/29
tags: ["angularjs", "caching", "html", "template", "ui-router"]
---

Unless you're using [gulp-angular-templatecache](https://www.npmjs.com/package/gulp-angular-templatecache) (which you probably should) to bundle your HTML templates into an Angular Javascript module, you might in some cases want to pre-cache certain HTML files. For example if you have a specific "error page" HTML template used to display a specific error message telling the user he [lost his Internet connection](/2015/12/01/pre-caching-html-templates-with-angularjs-ui-router-directive/). If you don't pre-cache such a template, your Angular app won't be able to fetch it from the server (because the browser is obviously off-line) and as a consequence it will be unable to display this important message.

If you're using [ui-router](https://github.com/angular-ui/ui-router), there is an easy way to pull the template from the server before it's even used. I like having an abstract `root` state which I setup in my `app.config()` (inside `app.js`) to kind of abstract my base layout. Views from this `root` state can then be overridden by any child state which is very handy for having a few different types of layouts. For example, some with a sidebar, some without, etc.

The cool thing about the abstract `root` state is that it will fetch all templates specified inside its _views_ property even if they're not used right away and it will put them into AngularJS' template cache. The next time any of our child ui-router states requires one of these cached templates, it won't make a request against the server but it will simply reuse the cached template.

```js
// app.js

$stateProvider
    .state("root", {
        abstract: true,
        views: {
            // base layout elements
            "header": {
                templateUrl: "/app/components/header.html"
            },
            "layout": {},
            "footer": {
                templateUrl: "/app/components/footer.html"
            },

            // cached templates
            "cachedErrorTemplate": {
                templateUrl: "/app/components/error.html"
            }
        }
    });
```

You can use this simple trick to if needed cache any other templates as well. Obviously don't overdo it because you want to make the smallest amount of initial requests you can to speed-up the loading time. Or even better - use angular-templatecache, it's wonderful. :)

Cheers!