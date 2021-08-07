---
title: Resolving AngularJS $http promises in services vs. controllers
date: "2015-06-03T00:00:00.000Z"
description: Should you be resolving AngularJS $http promises in services or controllers? Which one is better?
featuredImage: /assets/featured/angular-cogs.jpg
commentsUrl: https://github.com/tihomir-kit/tkit.dev/issues/35
tags: ["angularjs", "design patterns", "javascript", "promises"]
---

For some time now I've been asking myself one thing when it comes to resolving $http promises in Angular - "would it be a better practice to resolve them in services that make the calls or in controllers that call these services?". I always simply went with whatever was the practice on the current project as I didn't want to introduce inconsistencies into the project. Well I finally set down, played around with it a bit and gave it some active thinking. Turns out, the answer is hugely dependent on the context and there is no right or wrong way to do it but I'll explain how I decided to do it from now on.

This post is not about basic usage of $http, then, success, error, callbacks or promises in general. For that I recommend a very nice [blog post](http://www.dwmkerr.com/promises-in-angularjs-the-definitive-guide/) by dwmkerr.

Now, one "sub"-question I had here was should I use `then` or `success`. Although I noticed a lot of people seem to dislike using `success` and `error` callbacks because [their signatures are inconsistent](http://stackoverflow.com/a/16387215/413785) with the `then` callback (they are only a thin wrapper around it), I actually find it very useful that I don't have to extract the "data" from the response object on my own. If I need to do something like that I still have the option of falling back to using `then` (which is fine). Some people seem to be really bothered by this so they even go as far as to wrap their responses in new promises using `$q` to match the `then` signature, but [as Rick Strahl wrote](http://weblog.west-wind.com/posts/2014/Oct/24/AngularJs-and-Promises-with-the-http-Service#Summary) - in this case I don't really mind trading a bit of inconsistency for simplicity. I don't see a point in adding additional chunk of wrapper-code to every API call just for the sake of it. So, I decided to go with the `success`/`error` combination.

Back to the main question.. I never make any $http requests directly from controllers and along with any additional "client-side business logic", that code goes into services. As a rule of thumb, I decided to go with a very simple approach. Since most often what happens after the `success` callback kicks in is controllers concern, my services return $http promises. `Success` promises are then resolved from within controllers. If there really is a need (and if it's logical) to resolve the `success` callback in the service i will then do it there instead. The whole thing looks something like this:

```js
// Service method
this.getSomething = function () {
    return $http.get("/api/myEndpoint");
};

// Controller method
$scope.getSomething = function () {
    MyService.getSomething().success(function (data) {
        // do something with the data
    });
}
```

Now you're probably wondering - what about the error callbacks? I could think of a couple of different scenarios of what could go wrong here:

- Unhandled exceptions
- 404's
- Expected exceptions - such as unauthorized (401), forbidden (403) or anything else you might knowingly return from the back-end
- Back-end model validation (I decided to go with [422](http://stackoverflow.com/a/3291292/413785) for this)


To make my life easier, for the first three I decided to go with an [http-interceptor-service](/2015/09/27/handling-webapi-exceptions-with-angular-http-interceptor/) which is in charge of handling WebAPI exceptions. This way I don't have to rewrite the same error callback code for every $http request. It's nice, centralized and provides enough flexibility (assuming you're taking good care of your WebAPI and return proper http statuses).

As for the last, fourth case, I created a couple of directives that wrap html input elements (text, textarea, dropdown..), WebAPI model state and validation messages (which have the format of [foundation abide](http://foundation.zurb.com/docs/components/abide.html)). For this to work, model state is needed inside a controller and since $http treats 422 status code as an error so far this was the only situation where I had to resolve the `error` callbacks inside controllers. In this case the http interceptor simply skips any 422 it encounters and it can then be taken care of elsewhere. I will explain this in more detail in my next-next post. Pinky swear. ;)

The explained might not be the best way to cope with the whole problem but I it worked well for me so far so I hope I was at least able to provide a couple of useful ideas. I did try to google out other blog posts / SO threads about this but I only found a few ones that dealt with something similar but not entirely. If you know of any good ones, please feel free to drop a link down in the comments. Also, if you have a different approach which works for you or you see any problems with mine, please let me know.