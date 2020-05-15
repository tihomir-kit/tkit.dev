---
title: Broadcasting AngularJS events from vanilla JavaScript
date: "2016-09-02T00:00:00.000Z"
description: How to broadcast an AngularJS event to get back from vanilla JavaScript into AngularJS lifecycle.
featuredImage: /assets/featured/angular-cogs.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/25
tags: ["angularjs", "javascript", "events"]
---

In this short post I'll show how to invoke AngularJS from plain JavaScript. Why would you want to do this? Well, in certain edge cases you might need to catch events in plain JS but still want to handle them back inside your Angular app. For example on an SVG element mouse event..

Say you have an Angular controller named `SomeCtrl` and that's where you want to handle the event. You'll need an element you'll be able to target either by an id or by a class, and it needs to be scoped with a controller like this:

```cs
<!-- template.html -->

<div ng-controller="SomeCtrl">
  <div id="scoped-element"></div>
</div>
```

Next, say you have something like `onmouseover="onMouseOver()`"</em>` on one of your HTML/SVG elements:

```js
// event-handler.js

// Plain JS code
function onMouseOver() {
  var element = angular.element($("#scoped-element"));
  var scope = element.scope();
  scope.$root.$broadcast("mouse-over-event", { some: "data" });
}

// AngularJS controller (SomeCtrl) $broadcast listener
$scope.$on("mouse-over-event", function (event, data) {
  // data -> { some: "data" }
});
```

You'll need to add a `$scope.$on` listener for the _mouse-over-event_ event inside your `SomeCtrl` controller. Your Angular app will catch the broadcast, you'll be back inside the Angular scope and digest loop and you'll be able to handle the event further from there.

That's it!