---
title: Filtering collections by LIKE operator in LLBLGen Pro ORM
date: "2017-10-22T00:00:00.000Z"
description: How to filter record collections by a LIKE operator in LLBLGen Pro ORM?
featuredImage: /assets/featured/database.png
commentsUrl: https://github.com/pootzko/tkit.dev/issues/13
tags: [".net", "c#", "database", "llblgen", "orm"]
---

This will be a simple one. It's another useful way of filtering entity collections in LLBLGen Pro. If you don't know anything about filtering, predicate expressions or buckets in LLBLGen, check out some of the [other posts](/2017/10/23/llblgen-pro-tips/) from the series.

What the LIKE operator enables us to do in SQL is it allows us to filter collections by partial string matches which is a quite common action if you have any search input fields in your app. For example if we wanted to find all the products that have the word "blue" in their name we would use the LIKE operator. The way to do it in LLBLGen would be to use the [FieldLikePredicate](https://www.llblgen.com/Documentation/5.3/ReferenceManuals/LLBLGenProRTF/html/12BEFA44.htm):

```cs
// Fetch all products where the Name field cointains "blue" substring
var products = new EntityCollection<ProductEntity>();

var search = "blue";
var likePredicate = new FieldLikePredicate(ProductFields.Name, null, null, $"%{search}%");
var filter = new PredicateExpression(likePredicate);

using(var adapter = new DataAccessAdapter())
{
    adapter.FetchEntityCollection(products, filter);
}
```

There really isn't much more to it, it's pretty straightforward and simple.

Hope it helped. If you have any questions or comments, drop them below. Cheers!
