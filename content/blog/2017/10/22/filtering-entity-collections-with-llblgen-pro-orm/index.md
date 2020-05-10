---
title: Filtering entity collections with LLBLGen Pro ORM
date: "2017-10-22T00:00:00.000Z"
description: How to do basic entity filtering in LLBLGen Pro ORM?
featuredImage: /assets/featured/database.png
commentsUrl: https://github.com/pootzko/tkit.dev/issues/16
tags: [".net", "c#", "database", "llblgen", "orm"]
---

In the [previous post](/2017/10/22/fetching-nested-entities-with-llblgen-pro-orm/), we covered the topic of fetching nested entities (prefetching) and in this one we'll go over filtering entity collections. When talking about databases, filtering is one of the most commonly used operations. In LLBLGen, filtering means using [predicate buckets](https://www.llblgen.com/documentation/5.3/LLBLGen%20Pro%20RTF/Using%20the%20generated%20code/Filtering%20and%20Sorting/gencode_filteringbasics.htm).

We'll re-use the same DB schema throughout the whole [LLBLGen series](/2017/10/23/llblgen-pro-tips/) (made using [QuickDBD](https://www.quickdatabasediagrams.com/)):

![SQL Schema](sql-schema.jpg)

We'll cover two ways of filtering in this post. In the first one we'll filter by a field on the main entity of the collection (we'll filter products by price). In the second one we'll filter by fields of related entities (for instance, let's filter all orders created by customers named "Joe").

```cs
// Fetch all products with price greater than 10
var products = new EntityCollection<ProductEntity>();

var filter = new RelationPredicateBucket();
filter.PredicateExpression.Add(ProductFields.Price > 10);
// To filter by multiple fields at the same time, simply
// add additional predicate expressions to the filter

using(var adapter = new DataAccessAdapter())
{
    adapter.FetchEntityCollection(products, filter);
}


// Fetch all orders created by customers named "Joe"
var orders = new EntityCollection<OrderEntity>();

var filter = new RelationPredicateBucket();
filter.Relations.Add(OrderEntity.Relations.CustomerEntityUsingCustomerId);
filter.PredicateExpression.Add(CustomerFields.Name == "Joe");

using(var adapter = new DataAccessAdapter())
{
    adapter.FetchEntityCollection(orders, filter);
}
```

Please note that in addition to a predicate expression, for the second filter we also had to define a relation. If we didn't do it, we'd get a runtime error because we would have a mismatch between the entity collection type and the entity type of the field that we're filtering by.

In the following posts, we'll cover additional filtering scenarios which are maybe not as common as this one, but you'll still bump into them from time to time.

I hope this was helpful and if you have any questions, please drop a comment.
