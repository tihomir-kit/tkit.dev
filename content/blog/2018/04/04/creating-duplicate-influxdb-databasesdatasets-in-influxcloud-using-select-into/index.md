---
title: Creating duplicate InfluxDB databases/datasets in InfluxCloud using SELECT INTO
date: "2018-04-04T00:00:00.000Z"
description: How to duplicate data in InfluxDB using the SELECT INTO syntax?
featuredImage: /assets/featured/influxdb.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/9
tags: ["backup", "cloud", "copy", "database", "duplicate", "influxdata", "influxdb", "restore"]
seoKeywords: ["backup", "cloud", "copy", "database", "duplicate", "influxdata", "influxdb", "restore"]
---

InfluxCloud Chronograf currently doesn’t provide a fast and easy way of creating duplicates of your existing databases. Their support (which comes with the paid service) is sadly also very slow and it’s a bit of a chore to make them do anything for you within a reasonable timeframe unless it’s something supercritical.

So, if you’re in need of a way to create a backup and re-create a DB multiple times because you’re looking to test some destructive actions on your data (such as updating records) and you’re looking to avoid dealing with the “support”, here’s a hacky way to deal with it which might end up being the faster thing to do.

Meet Mr. [SELECT INTO](https://docs.influxdata.com/influxdb/v1.5/query_language/data_exploration/#the-into-clause). What SELECT INTO aims to do is to help you out in copying all your data from all the measurements you might have into a newly created database (has to be pre-created before running the query). It also aims to keep your existing data structure (measurement names and what records go where). In its simplest form and in ideal circumstances the query that you’ll need to execute will look like this:

```sql
SELECT *                              -- copies all values
INTO "dbTo"."autogen".:MEASUREMENT    -- magically keeps the data structure intact
FROM "dbFrom"."autogen"./.*/          -- copies all measurements
GROUP BY *                            -- copies all tags
```

A few details that are not so great about the vanilla SELECT INTO approach:

1. Continuous Queries will not be copied over.
2. If you try to run the SELECT INTO query from the Chronograf “Data Explorer”, and you have a dataset which is not trivially small – the Chronograf request with your query will timeout after 60s and the query will simply stop. It won’t even continue running in the background.
3. Data types of some values might change for no apparent reason.. For example INT columns (values) might get converted to FLOATs upon data copying although all the data stored in these columns WAS initially actually INT data.. (?!) This is interesting because it might come back later and bite you once you try to execute aggregate functions to backfill some of the downsampled measurements with new/fixed data. What exactly is the issue with that? For example the SELECT INTO query might not convert INT’s to FLOAT’s for downsampled measurements (which are typically populated by CQ’s) but only for the “lowest resolution” measurements (measurement you insert the data into explicitly). So after your happily copied over all the data, if you try to insert a max(thought_it_was_an_int) from the default measurement into a downsampled one it will now try to store a FLOAT into an INT column and this will obviously return an exception. Happy days.

What this means:

1. Probably not a big deal if you just want to mess with the data, but keep it in mind.
2. You’ll have to break your data down into smaller datasets to copy over (for example into one day data chunks using a **WHERE time** … clause). You’ll probably need an SDK library (such as [InfluxData.Net](https://github.com/pootzko/InfluxData.Net)) to automate the process.
3. You’ll have to ditch the wildcard SELECT from the vanilla example and manually select (and explicitly cast) all the columns that you want to copy over to the new DB. This will make the process slightly more complicated but at this point you’re probably automating everything through a small script / migration app anyway so it shouldn’t be too much additional work.

So, here’s a proof-of-concept code sample that explicitly selects columns to copy over, forces casting to INT data type (or keeps the data type intact), selects specific source and target measurements (tables) and selects only a single day worth of data. You will have to iterate through 1-2 loops to inject your desired source and target table names and time ranges to cover all the data that you’ve got in your DB.

```sql

SELECT                                               -- explicit value selecting and casting
  time,
  Humidity::integer,
  Temperature::integer,
  State
INTO "dbTo"."autogen"."sensor"                       -- explicit target db
FROM "dbFrom"."autogen"."sensor"                     -- explicit source db
WHERE time > '2018-03-25' AND time <= '2018-03-26'   -- explicit time range
GROUP BY *                                           -- copies all tags
```

I really hope this helps and saves you some time. If you have any questions, feel free to leave a comment.

&#35;FastNotFastButMaybeFaster

Cheers!