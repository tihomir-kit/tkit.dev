---
title: Filtering collections by multiple field values in LLBLGen Pro ORM
date: "2017-10-22T00:00:00.000Z"
description: How to filter record collections by multiple field values at the same time in LLBLGen Pro ORM?
featuredImage: /assets/featured/database.png
commentsUrl: https://github.com/pootzko/tkit.dev/issues/12
tags: [".net", "c#", "database", "llblgen", "orm"]
---

Sometimes we need to fetch a very specific subset of records from the database. For example when we already have a list of specific Id’s of records that we need to fetch. That’s what this post will cover.

To accomplish this kind of filtering with LLBLGen we need to use the [FieldCompareRangePredicate](http://www.llblgen.com/Documentation/5.3/ReferenceManuals/LLBLGenProRTF/html/E6DD0632.htm). It’s usage is very similar to the FieldLikePredicate from the [previous post](/2017/10/22/filtering-collections-by-like-operator-in-llblgen-pro-orm/) of the [series](/2017/10/23/llblgen-pro-tips/).

```cs
// Fetch all products that match product id's from the array
var ids = new[] { 1, 5, 8, 9 };
var products = new EntityCollection<ProductEntity>();

var rangePredicate = new FieldCompareRangePredicate(ProductFields.ProductId, null, ids);
var filter = new PredicateExpression(rangePredicate);

using(var adapter = new DataAccessAdapter())
{
    adapter.FetchEntityCollection(products, filter);
}
```

That’s it. If you have any questions, please leave them bellow.
