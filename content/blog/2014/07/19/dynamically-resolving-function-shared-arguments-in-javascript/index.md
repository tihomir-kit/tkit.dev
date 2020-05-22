---
title: Dynamically resolving function shared arguments in JavaScript
date: "2014-07-19T00:00:00.000Z"
description: How to dynamically pass an arbitrary amount of function arguments to a JS function if we don't know in advance how many we'll have to pass?
featuredImage: /assets/featured/javascript.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/39
tags: ["callbacks", "design patterns", "javascript", "dynamic programming"]
---

Sometimes we have functions which expect the same arguments as other functions, all fine there. Sometimes these arguments are obtained/resolved asynchronously. If there are a lot of these functions that share the same resource, we can come up with lot of unnecessary boilerplate.

Imagine having a function like `resolveMetaData()` which asynchronously obtains fresh data every time it's called (to keep the code at a very simple level, for the purpose of this post I'll be using `setTimeout()` instead of something a bit more complex like an AJAX call):

```js
function resolveMetaData(callback) {
    // for the purpose of the demo we'll simply mock the metaData object
    var metaData = { message: "Meta message", start: new Date() };

    // async business logic example
    setTimeout(function () {
        metaData.end = new Date();
        // after metaData is ready, resolve callback
        callback(metaData);
    }, 1000);
}
```

And two functions that require a new instance of `metaData` upon their execution:

```js
function fnOne(data, metaData) {
    console.log(data);
    console.log(metaData);
}

function fnTwo(id, data, metaData) {
    console.log(id);
    console.log(data);
    console.log(metaData);
}
```

The simplest way to provide the latest `metaData` to these functions would be to use callbacks like this:

```js
resolveMetaData(function(metaData) {
    fnOne("fnOne", metaData);
});

resolveMetaData(function(metaData) {
    fnOne(1, "fnTwo", metaData);
});
```

If you had to write a lot of functions similar to `fnOne()` and `fnTwo()` (ie. 10 or more) and all of them required the latest `metaData`, you would most probably be tempted to somehow reduce the code and get rid of the callback boilerplate. The first two ideas that came to my mind on how to resolve this were function overloads and/or having a base function that would handle `metaData` resolving. Since [JS doesn't really support overloading](http://stackoverflow.com/questions/456177/function-overloading-in-javascript-best-practices) (in the same way as say [C# does](http://csharpindepth.com/Articles/General/Overloading.aspx)), having a base function to handle `metaData` resolving seems like a safe bet. The only question is - how do we call a function in JS with the parameters we got and resolve the shared parameters asynchronously?

Fortunately [Function.prototype.apply()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply) comes to the rescue! It allows us to call a function with arguments as an array which is quite handy. Since functions in JS are objects, we can now create a base function which accepts the function object of the function we wish to call, and the `args` we have at that point. It then resolves `metaData`, appends it to the `arguments` array and calls the passed function with these arguments. This is how the base function would look like:

```js
function fnBase(fn, args) {
    resolveMetaData(function (metaData) {
        args.push(metaData);
        fn.apply(this, args);
    });
}
```

And this is the how we can now call `fnOne()` and `fnTwo()` through the `fnBase()`:

```js
fnBase(fnOne, ["fnOne"]);
fnBase(fnTwo, [1, "fnTwo"]);
```

It would be possible to place `metaData` as a first argument in `fnOne()` and `fnTwo()` signatures but that would require additional `args` position handling in `fnBase()` so it is probably best to put `metaData` as the last argument.

That's it, hope it helps. Enjoy! :)