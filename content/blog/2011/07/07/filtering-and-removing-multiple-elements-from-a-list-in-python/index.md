---
title: Removing multiple elements from a list in Python
date: "2011-09-11T00:00:00.000Z"
description: How to remove multiple elements from a list in Python and not break the list while doing so?
featuredImage: /assets/featured/python.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/24
tags: ["elements", "list", "python", "removal"]
---

Let's say you need to filter a Python list and remove all elements that match a given criteria. If you wanted to remove a single element, you could just use `del list[i]` ([example](http://docs.python.org/py3k/tutorial/datastructures.html#the-del-statement)). But if you wanted to remove multiple elements this might be a problem since you would be modifying and iterating over the list at the same time (keeping track of list indexes can become very confusing, very fast).

A simple solution to this problem would be to keep record of all list elements (indexes) that need to be removed, and to remove them afterwards. Also, one other thing to be wary about is that the removal process should be done in reverse because otherwise you would shift all the elements to the 'left' every time you removed an element from a list and you would (again) have to keep track of list indexes.

A simple function example:

```py
matchingFilter = ['criteria1', 'criteria2']

def criteriaFiltering(aList, matchingFilter):
  deletionIndexes = []
  i = 0

  for listLine in aList:
    for match in matchingFilter:
      if match in str(listLine):
        continue
      else:
        deletionIndexes.append(i)
        break
    i += 1

  for number in reversed(deletionIndexes):
    del listLines[number]

  return aList
```

This might not be the fastest "algorithm" to do the job, but it worked well enough for me..