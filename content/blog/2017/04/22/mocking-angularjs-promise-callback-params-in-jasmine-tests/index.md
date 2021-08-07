---
title: Mocking AngularJS promise callback params in Jasmine tests
date: "2017-04-22T00:00:00.000Z"
description: How to mock promises in AngularJS Jasmine unit tests?
featuredImage: /assets/featured/jasmine-js.jpg
commentsUrl: https://github.com/tihomir-kit/tkit.dev/issues/18
tags: ["angularjs", "callbacks", "jasmine", "javascript", "params", "promises", "unit testing"]
---

You could argue that in a scenario such as this one, you should ideally have a separate, stand-alone callback function to handle the success response of a promise, but this post is not about that. It's about an occasional need to mock a promise and perhaps it's callback params in Jasmine unit-tests and this is a simple example of how it can be done.

This is an example of a function you might find in an AngularJS controller (written in TypeScript, but doesn't matter, it would be almost identical in JS).

```js
// This is just one function of some AngularJS controller, didn't
// mock up the whole controller for the purpose of the blog post
private loadData(shortcode: string): void {
  this.SomeDataService.getData(someGetParam).then((successResponse: any) => {
    if (!successResponse.data) {
      this.ToastService.showError("Item does not exist.");
      return;
    }

    this.CacheService.updateCache({
      data: this.model.data,
      someGetParam: someGetParam
    });
  });
}
```

It contains a call to a service function which in turn returns a promise. That promise returns a successResponse and that's what we're about to mock. What we want to test is a situation where a `$http` request didn't fail, but it didn't return any data either. In that case, we might want to display a toast message and skip refreshing the local cache.

The following Jasmine test explains the code in-line. Two crucial parts are creation of the promise and how to resolve it and forcing the angular digest cycle with `$rootScope.$apply()`. The `$apply()` is needed because we're invoking the promise from the Jasmine side, which is sort of "from the outside" and AngularJS will not be aware of that the event occurred so we need to let it know manually (the promise resolution wasn't triggered by AngularJS itself internally).

```js
describe("getData()", function () {
  describe("on no returned data", function () {
    it("shows a toast message and doesn't update cache", function () {
      // Here we mock an invalid successResponse object, we add some random property
      // just to make sure to know exactly what to expect from the callback
      // Notice there is no "data" property on it
      var successResponseMock = { noData: "returned" };
      var someGetParam = "someGetParamVal";
      var deferred = $q.defer();

      // Set up spies we want to check
      spyOn(_SomeDataService, "getData").and.returnValue(deferred.promise);
      spyOn(_CacheService, "updateCache");
      spyOn(_ToastService, "showError");

      // Here we set up the wanted behaviour of the promise
      deferred.promise.then(function (successResponse) {
        expect(successResponse).toEqual(successResponseMock);
      });

      // Here we call the loadData(), force promise resolve and then
      // force the $rootScope.$apply() to trigger the digest cycle
      _SomeCtrl.loadData(someGetParam);
      deferred.resolve(successResponseMock);
      $rootScope.$apply();

      // Here we test the expected behaviour
      expect(_CacheService.updateCache).not.toHaveBeenCalled();
      expect(_ToastService.showError).toHaveBeenCalled();
    });
  });
});
```

Hope that helps. If you know of an easier way to do this, please let me know in the comments. Thanks!
