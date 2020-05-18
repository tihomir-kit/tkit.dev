---
title: Detecting no-Internet / user-offline in Angular
date: "2016-01-19T00:00:00.000Z"
description: How to detect that the user lost the internet connection in AngularJS?
featuredImage: /assets/featured/angular-cogs.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/28
tags: ["angularjs", "http", "interceptor", "offline", "detection"]
---

Sometimes, a user might find himself disconnected from the Internet after he already got to your page. Given the nature of SPA apps, this situation might not be very obvious to the user at first and he might end up thinking that the "site doesn't work". If the user goes offline after he already landed on your AngularJS site, the back-end API's won't be accessible any more but all the client-side stuff will still remain loaded if the user does not refresh the page. The problem is - because the page is still visible and some events still respond to his input, he might not notice (or even understand) what actually happened.

This may result with a call from your client. :) To prevent having to explain the whole situation, it might be easier to handle this situation in advance. For example, you could detect if the user is offline and then redirect him to a "warning" or an "error" page (you might want to [pre-cache the error page template](2015/12/01/pre-caching-html-templates-with-angularjs-ui-router-directive/) upon page load).

There is a very simple way in AngularJS to detect whether the user is disconnected from the Internet or not. Simply use/attach the following `http-request-interceptor` to your app.

```js
// http-request-interceptor.js

(function () {
    "use strict";

    angular
        .module("YourApp.Common")
        .factory("httpRequestInterceptor", HttpRequestInterceptor);

    // USAGE
    // Add the following line inside your app.js .config()
    // $httpProvider.interceptors.push("httpRequestInterceptor");
    HttpRequestInterceptor.$inject = ["$q"];
    function HttpRequestInterceptor($q) {
        return {
            responseError: function (rejection) {
                if (rejection.status === 0) {
                    // For example - redirect user to an "offline" page here
                }

                return $q.reject(rejection);
            }
        };
    }
})();
```