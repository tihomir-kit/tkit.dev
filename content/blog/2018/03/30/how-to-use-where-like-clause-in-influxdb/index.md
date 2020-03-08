---
title: How to use WHERE LIKE clause in InfluxDB?
date: "2018-03-30T00:00:00.000Z"
description: How to write a SQL WHERE LIKE equivalent in InfluxDB?
featuredImage: /assets/featured/influxdb.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/4
tags: ["database", "influxdb"]
seoKeywords: ["database", "influxdb"]
---

In this short post I’ll explain how to write a **WHERE LIKE** clause in InfluxDB. The syntax is slightly different from what you would use in standard SQL. There is no LIKE clause per se and instead syntax resembles pattern matching with an equality or negation operator.

Bellow are two very simple examples. The first one returns all the records where SensorName starts with abcd and the second one returns all the records where _SensorName_ doesn’t start with _abcd_.

```sql
SELECT * FROM "sensor" WHERE SensorName =~ /abcd*/ AND time > now() - 5m
SELECT * FROM "sensor" WHERE SensorName !~ /abcd*/ AND time > now() - 5m
```

This should be enough to get you started. Cheers!
