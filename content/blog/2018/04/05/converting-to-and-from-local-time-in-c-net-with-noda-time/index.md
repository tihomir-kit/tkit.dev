---
title: Converting to and from local time in C#/.Net with Noda Time
date: "2018-04-05T00:00:00.000Z"
description: How to handle timezone conversions between utc and local time in C# / .Net using Noda Time library?
featuredImage: /assets/featured/noda-time.png
commentsUrl: https://github.com/pootzko/tkit.dev/issues/5
tags: ["nodatime", "time", "c#", ".net", "timezone", "handling", "conversion"]
seoKeywords: ["nodatime", "noda", "time", "c#", ".net", "timezone", "handling", "code", "sample", "demo", "tutorial", "utc", "simple", "easy", "conversion"]
---

Working with DateTime in .Net [can be quirky](https://blog.nodatime.org/2011/08/what-wrong-with-datetime-anyway.html). Even more, default .Net libraries follow MS standards and use [their own set of timezones](https://stackoverflow.com/a/7908482/413785) instead of the widely accepted [TZDB (IANA)](https://en.wikipedia.org/wiki/Tz_database) standard (which you should probably be using instead – because standards are good for you). Without going into too much detail, you will probably do yourself a favour if you go straight to [Noda Time](https://nodatime.org/) library for all your timezone conversion needs. Noda Time is a very powerful library for handling all things date and time and it’s made by none other than Jon Skeet himself. To make things easy and precise for all of us, he keeps track of all the changes that happen to the [TZDB list](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) (yes, countries still keep changing these things around) and makes sure the library is up to date.

The two examples in the demo explain the most basic things you might want to do with time and timezones:

 1. Converting UTC time to local time in a certain timezone
 2. Trying to find out what the UTC representation of time is for local time in a certain timezone


I used the *US/Pacific* timezone (which is UTC-8h) in sample code. All screenshots display current variable values so it’s easy to follow what’s going on with various date objects as they get converted back and forth.

The first example creates a UTC DateTimeKind DateTime object and converts it to local *US/Pacific* time and the second example converts the local *US/Pacific* object of *Unspecified* DateTimeKind to UTC. Notice how time in both examples gets shifted by 8h but in opposite directions.

IMAGE_HERE

And since that was a screenshot, here is the code sample in case you want to c/p it:

```cs
var timezone = "US/Pacific";

var utc = new DateTime(2018, 1, 9, 14, 4, 6, DateTimeKind.Utc);
var localFromUtc = utc.ToZone(timezone);

var unspecified = new DateTime(2018, 1, 9, 14, 4, 6, DateTimeKind.Unspecified);
var utcFromLocal = unspecified.InZone(timezone);
```