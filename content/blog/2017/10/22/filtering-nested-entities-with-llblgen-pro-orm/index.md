---
title: Filtering nested entities with LLBLGen Pro ORM
date: "2017-10-22T00:00:00.000Z"
description: How to filter prefetched (nested / child) entities in LLBLGen Pro ORM?
featuredImage: /assets/featured/database.png
commentsUrl: https://github.com/tihomir-kit/tkit.dev/issues/15
tags: ["dotnet", "csharp", "database", "llblgen", "orm"]
---

In this post, we'll cover how to filter nested entities when fetching either a single entity or a collection of entities. How is this different from the second filtering example from the [previous post](/2017/10/22/filtering-entity-collections-with-llblgen-pro-orm/)? Well, in the previous post we demonstrated _how to filter main entities BY fields_ of related tables. This post explains _how to filter nested entities_, or how to choose _which nested entities_ to prefetch.

Again we'll use the same DB schema from some of my other [LLBLGen posts](/2017/10/23/llblgen-pro-basics/) (made using [QuickDBD](https://www.quickdatabasediagrams.com/)):

![SQL Schema](sql-schema.jpg)

What we need to do is simply create a PredicateExpression and add it to the prefetchPath:

```cs
// Fetch all customers and only prefetch orders
// with TotalAmount bigger than 15
var customers = new EntityCollection<CustomerEntity>();

var prefetchPath = new PrefetchPath2(EntityType.CustomerEntity);
var orderPredicate = new PredicateExpression(OrderFields.TotalAmount > 15);
var orderPrefetchPath = prefetchPath.Add(CustomerEntity.PrefetchPathOrder, 0, orderPredicate);

using(var adapter = new DataAccessAdapter())
{
    adapter.FetchEntityCollection(customers, prefetchPath);
}


// Fetch all customers and only prefetch orders when
// the corresponding product price is bigger than 20
var customers = new EntityCollection<CustomerEntity>();

var prefetchPath = new PrefetchPath2(EntityType.CustomerEntity);
var orderBucket = new RelationPredicateBucket();
orderBucket.Relations.Add(OrderEntity.Relations.ProductEntityUsingProductId);
orderBucket.PredicateExpression.Add(ProductFields.Price > 20);
var orderPrefetchPath = prefetchPath.Add(CustomerEntity.PrefetchPathOrder, 0, orderBucket.PredicateExpression, orderBucket.Relations);

using(var adapter = new DataAccessAdapter())
{
    adapter.FetchEntityCollection(customers, prefetchPath);
}
```

The second example demonstrates how to use a RelationPredicateBucket instead of a PredicateExpression if you need to filter nested entities by multiple fields or if you need to filter by sub-nested entities (i.e. products). If you don't have to add any bucket relations, you can omit the last param.

Also, keep in mind you can add these predicates/buckets to prefetches whether you're fetching a single or a collection of entities.

Feel free to leave a comment or ask a question below.