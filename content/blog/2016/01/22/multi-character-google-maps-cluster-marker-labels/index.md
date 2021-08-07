---
title: Multi-character Google Maps cluster marker labels
date: "2016-01-22T00:00:00.000Z"
description: How to override Google Maps cluster markers to allow multiple characters per label instead of only a single one?
featuredImage: /assets/featured/google-maps-clusters.jpg
commentsUrl: https://github.com/tihomir-kit/tkit.dev/issues/27
tags: ["api", "cluster", "css", "google", "html", "javascript", "maps"]
---

Turns out [Google Maps API](https://developers.google.com/maps/documentation/javascript/examples/) does not allow for more than a single character on marker labels (everything past the first character gets trimmed). Not even StackOverflow was able to provide me with a good way of going around this (take a look at [this](http://stackoverflow.com/questions/32467212/google-maps-marker-label-with-multiple-characters) and [this](http://stackoverflow.com/questions/34044520/showing-multiple-characters-in-google-map-marker)). So, a little digging was required...

Fortunately, folks who made [google-maps-clustering-csharp](https://github.com/kunukn/Google-Maps-Clustering-CSharp) were able to go around this restriction by implementing a custom "label element" through prototyping the _[OverlayView](https://developers.google.com/maps/documentation/javascript/examples/overlay-simple)_ element and then using it instead of a string for Marker's _label_ property. I extracted and cleaned up the code from their MVC application. What's left is all you need to render markers that support multiple characters (feel free to break it into multiple files - perhaps a service and a controller if you're using AngularJS or something similar):

```js
// cluster-markers.js

///// MarkerLabel section

var MarkerLabel = function(options, marker, text) {
    this.setValues(options);
    this.set("text", text);
    var span = this.span_ = document.createElement("span");
    span.className = getGmcIconClass(text);

    var div = this.div_ = document.createElement("div");
    div.appendChild(span);
    div.style.cssText = "position: absolute; display: none;";

    this.bindTo("position", marker, "position");
    this.bindTo("visible", marker, "visible");
}

// Change to use different thresholds for different cluster images
function getGmcIconClass(text) {
    var clusterIconClass = "gmc-cluster-";
    if (text >= 10000) clusterIconClass += 5;
    else if (text >= 1000) clusterIconClass += 4;
    else if (text >= 100) clusterIconClass += 3;
    else if (text >= 10) clusterIconClass += 2;
    else clusterIconClass += 1;
    return clusterIconClass;
}

// Inherit from OverlayView prototype
MarkerLabel.prototype = new google.maps.OverlayView;
MarkerLabel.prototype.onAdd = function () {
    var pane = this.getPanes().overlayLayer;
    pane.appendChild(this.div_);

    // Register event listeners
    var thisLabel = this;
    this.listeners_ = [
        google.maps.event.addListener(this, "idle", function () { thisLabel.draw(); }),
        google.maps.event.addListener(this, "visible_changed", function () { thisLabel.draw(); }),
        google.maps.event.addListener(this, "position_changed", function () { thisLabel.draw(); }),
        google.maps.event.addListener(this, "text_changed", function () { thisLabel.draw(); })
    ];
};

// Define onRemove listener (triggered by the setMap(null))
MarkerLabel.prototype.onRemove = function () {
    this.div_.parentNode.removeChild(this.div_);

    for (var i = 0; i < this.listeners_.length; ++i) {
        google.maps.event.removeListener(this.listeners_[i]);
    }
};

// On "draw"
MarkerLabel.prototype.draw = function () {
    var projection = this.getProjection();
    var position = projection.fromLatLngToDivPixel(this.get("position"));

    var div = this.div_;
    div.style.left = position.x + "px";
    div.style.top = position.y + "px";

    var visible = this.get("visible");
    div.style.display = visible ? "block" : "none";

    this.span_.innerHTML = this.get("text").toString();
};

// Needs to be used to make markers clickable
var emptyClusterImage = new google.maps.MarkerImage("/assets/images/cluster-empty.png",
    new google.maps.Size(60, 60),
    null, new google.maps.Point(30, 30)
);



///// Rendering section

var markers = [];
var markerLabels = [];

// For drawing clusters on the map
function drawClusterMarker() {
    _.each(points, function (point) {
        var identifier = point.x.toString() + point.y.toString(); // used as hash
        var position = new google.maps.LatLng(point.x, point.y);

        if (!markers[identifier]) {
            var marker = new google.maps.Marker({
                map: map, // where map is a new google.maps.Map object
                position: position,
                icon: emptyClusterImage, // Needs to be used to make markers clickable
                title: point.count.toString()
            });

            var markerLabel = new MarkerLabel({
                map: map // the same google.maps.Map object as above
            }, marker, point.count);

            marker.addListener("click", function () {
                // example of marker onClick action
                map.panTo(marker.position);
                map.setZoom(7);
            });

            markers[identifier] = marker;
            markerLabels[identifier] = markerLabel;
        }
    });
}

// For clearing cluster markers from the map
function clearClusterMarkers() {
    // _.each() comes from lodash, it's also supported by jQuery - $.each()
    _.each(markers, function (marker, key) {
        google.maps.event.clearInstanceListeners(marker);
        marker.setMap(null);
        var markerLabel = markerLabels[key];
        if (markerLabel)
            markerLabel.setMap(null);
    });

    markers = [];
}
```

And this is the CSS that's needed to make it all work (you can find the cluster icons [here](https://github.com/tihomir-kit/other/tree/master/gmc-icons)):

```scss
// gmc-cluster.scss

.gmc-cluster-1, .gmc-cluster-2, .gmc-cluster-3, .gmc-cluster-4, .gmc-cluster-5 {
    font-family: arial;
    display: block;
    position: relative;
    font-weight: bold;
    text-align: center;
    white-space: nowrap;
    color: #fff;
}


.gmc-cluster-1 {
    left: -26px;
    top: -26px;
    line-height: 52px;
    font-size: 12px;
    background: url(/assets/images/cluster-1.png) no-repeat 0 0;
    width: 53px;
    height: 52px;
}

.gmc-cluster-2 {
    left: -28px;
    top: -28px;
    line-height: 55px;
    font-size: 12px;
    background: url(/assets/images/cluster-2.png) no-repeat 0 0;
    width: 56px;
    height: 55px;
}

.gmc-cluster-3 {
    left: -33px;
    top: -33px;
    line-height: 65px;
    font-size: 12px;
    background: url(/assets/images/cluster-3.png) no-repeat 0 0;
    width: 66px;
    height: 65px;
}

.gmc-cluster-4 {
    left: -39px;
    top: -39px;
    text-align: center;
    line-height: 77px;
    font-size: 12px;
    background: url(/assets/images/cluster-4.png) no-repeat 0 0;
    width: 78px;
    height: 77px;
}

.gmc-cluster-5 {
    left: -45px;
    top: -45px;
    line-height: 89px;
    font-size: 12px;
    background: url(/assets/images/cluster-5.png) no-repeat 0 0;
    width: 90px;
    height: 89px;
}
```

Cheers!