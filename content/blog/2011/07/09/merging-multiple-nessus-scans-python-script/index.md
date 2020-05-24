---
title: Merging multiple Nessus scans
date: "2011-07-09T00:00:00.000Z"
description: How to combine multiple Nessus scan XML files into a single one for further analysis with a simply Python script?
featuredImage: /assets/featured/python.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/45
tags: ["nessus", "python", "reports", "security"]
---

If you have the need to merge / combine a few Nessus scans into a single *.nessus file, you can do so using this simple Python script. Since *.nessus files are basically just XML files with a different extension, what this script does is it finds all the *.nessus files in the current folder, finds all the "ReportHost" XML nodes accumulating them into a single report.nessus file which is then exported to nss_report folder.

Note that **scans must be of the same type** (same plugins must be used), but they can be from different subnets or different parts of the same subnet.

How to use it? - Put the script and all your *.nessus files into a same folder, run the script, import nss_report/report.nessus into Nessus - and there you have it, all the hosts are in one place..

```py
#! /usr/bin/env python3.2

import xml.etree.ElementTree as etree
import shutil
import os

first = 1
for fileName in os.listdir("."):
  if ".nessus" in fileName:
    print(":: Parsing", fileName)
    if first:
      mainTree = etree.parse(fileName)
      report = mainTree.find('Report')
      first = 0
    else:
      tree = etree.parse(fileName)
      for element in tree.findall('.//ReportHost'):
        report.append(element)
    print(":: => done.")

if "nss_report" in os.listdir("."):
  shutil.rmtree("nss_report")

os.mkdir("nss_report")
mainTree.write("nss_report/report.nessus", encoding="utf-8", xml_declaration=True)
```

If you have any questions, just drop a comment bellow..

_EDIT: [mastahyeti](http://btoe.ws/) made [some improvements](/2011/07/09/merging-multiple-nessus-scans-python-script/#comment-3214) to this script, you can get it at [his GitHub](https://gist.github.com/2720173)_