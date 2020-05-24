---
title: Detecting anomalies in InfluxDB data using Twitter Anomaly Detection, WebAPI and Azure ML Studio
date: "2019-07-22T00:00:00.000Z"
description: xxxxxxxxxxxxxxxxxxxxx?
featuredImage: local-anomaly.png
commentsUrl: https://github.com/pootzko/tkit.dev/issues/46
tags: [".net", "anomaly detection", "asp.net", "azure", "c#", "influxdb", "machine learning", "twitter", "webapi"]
---

First of all, a massive shout out to [Tej Redkar's](https://www.linkedin.com/in/tejaswiredkar/) and his [Operationalizing Twitter’s Anomaly Detection in AzureML](https://www.linkedin.com/pulse/operationalizing-twitters-anomaly-detection-azureml-tejaswi-redkar/) post which was huge help in figuring out how to make this all work.

First I looked at what kind of anomaly detection libraries even existed and [Twitter's Anomaly Detection](https://anomaly.io/anomaly-detection-twitter-r/) (TAD/AD in the rest of the text) would always bubble up as a winner. There were a few stand-alone libraries and some TAD ports for libraries for C#/.Net, but most of them seemed unmaintained.  The main problem was that the Twitter's library was written in [R](https://github.com/twitter/AnomalyDetection/tree/master/R)... So I looked at how I could potentially run that on Azure and that's when I found Tej's post. I struck gold! Turns out Twitter's library will work fine there and somebody already did it.

After spending some time on it, I finally got it all working. So, why this post then? I felt like I wasted some unnecessary time because Tej I guess assumed people would be more familiar with certain details or he simply skipped them by accident. I will try to go into a little more detail and hopefully between his and my blog post, you'll be covered. I also refactored his R [integration](https://github.com/dynamicdeploy/analytics-machinelearning/blob/master/Anomaly%20Detection/R/azureml_ts_anom_detection.R) of TAD and made it a little more clear in terms of variable naming. I also added [InfluxDB](https://www.influxdata.com/) to the mix, which InfluxDB users might find interesting / useful.

Now, the general workflow I have is this:

- A user lands on the website (SPA) and initializes AD for a certain time range and a set of AD parameter from the UI
- SPA application calls .Net WebAPI and doesn't care how WebAPI handles it all, it just wants an image as a result
- Since the data source I want to detect anomalies on comes from InfluxDB, WebAPI should somehow instruct AzureML to fetch the data itself
  - Since AD requires a substantial amount of data to process and provide good results, it doesn't make sense to pull it all into WebAPI and to then proxy it all the way down to AzureML, that would be a waste of time and resources
  - Since InfluxDB supports REST requests, it made much more sense to just send the request parameters to AzureML and let it fetch the data itself
- So, WebAPI fires a request against AzureML and as the payload, sends the InfluxDB REST request parameters and a set of AD params (which tweak how AD will work, i.e. be more or less sensitive in detection etc.)
- AzureML executes the REST request using Python, receives the data in CSV format and then converts it to a format that AzureML will be able to work with
- The next step of the AzureML "experiment" selects the data columns to use
- Data for selected columns gets passed on to the next step - "Twitter Anomaly Detection" (which consists of the Twitter's R library and Tej's R wrapper script)
- Twitter AD crunches the numbers and returns two outputs
  - Result dataset - detected anomalies
  - View port dataset - an image we can embed on our website
- Results get sent back to the WebAPI which in turn sends them back to the browser which then renders the image


This is what the AzureML experiment looks like:

![AzureML experiment](anomaly-detection-map.png)

```
https://YOUR.INFLUX.SERVER:8086/query?u=USERNAME&amp;p=PASSWORD&amp;db=DBNAME&amp;q=select+time%2C+Temp+as+value+from+%22sensor.series%22+where+(SensorId+%3D+%270001%27)+and+(time+%3E%3D+%272018-11-01+00%3A00%3A00%27+and+time+%3C+%272018-12-01+00%3A00%3A00%27)
```

```html
<img ng-src=”data:image/png;base64,{{anomalies.plot}}” />
```

https://github.com/pootzko/witad