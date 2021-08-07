---
title: How to generate an IP range list in Python?
date: "2011-09-11T00:00:00.000Z"
description: A simple method to generate an IP range from two string IP's in Python.
featuredImage: /assets/featured/python.jpg
commentsUrl: https://github.com/tihomir-kit/tkit.dev/issues/21
tags: ["generator", "ip", "list", "python"]
---

Here's a short Python snippet that generates a list of IP addresses based on IP range. Nothing fancy, but could come in handy if you ever need it somewhere in your code. Enjoy!

```py
def ipRange(start_ip, end_ip):
  start = list(map(int, start_ip.split(".")))
  end = list(map(int, end_ip.split(".")))
  temp = start
  ip_range = []

  ip_range.append(start_ip)
  while temp != end:
    start[3] += 1
    for i in (3, 2, 1):
      if temp[i] == 256:
        temp[i] = 0
        temp[i-1] += 1
      ip_range.append(".".join(map(str, temp)))

  return ip_range


# sample usage
ip_range = ipRange("192.168.1.0", "192.171.3.25")
for ip in ip_range:
  print(ip)
```