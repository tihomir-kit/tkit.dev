---
title: Translating canvas mouse position to JointJS matrix coordinates
date: "2017-03-07T00:00:00.000Z"
description: How to convert the JointJS mouse position to the canvas matrix coordinates?
featuredImage: /assets/featured/javascript.jpg
commentsUrl: https://github.com/tihomir-kit/tkit.dev/issues/19
tags: ["angularjs", "javascript", "jointjs", "matrix", "translation", "vector"]
---

If you need a way to convert the JointJS mouse position to the canvas matrix coordinates, this is a simple way to do it (in combination with an angular mouse wheel event):

```js
angular.element("#paper").bind("mousewheel", function (event) {
  var svgPoint = this.paper.svg.createSVGPoint();
  svgPoint.x = event.offsetX;
  svgPoint.y = event.offsetY;

  var pointTransformed = svgPoint.matrixTransform(this.paper.viewport.getCTM().inverse());

  console.log(svgPoint);
  console.log(pointTransformed);
});
```

Short, but hopefully helpful! Cheers!