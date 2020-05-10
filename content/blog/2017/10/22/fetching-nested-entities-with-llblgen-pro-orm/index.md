---
title: Fetching nested entities with LLBLGen Pro ORM
date: "2017-10-22T00:00:00.000Z"
description: How to fetch (prefetch) nested entities in LLBLGen Pro ORM?
featuredImage: /assets/featured/database.png
commentsUrl: https://github.com/pootzko/tkit.dev/issues/17
tags: [".net", "c#", "database", "llblgen", "orm"]
---

In this post, I'll quickly explain how to fetch "nested" (related) entities with [LLBLGen Pro ORM framework](https://www.llblgen.com/). In LLBLGen this operation is called [prefetching](https://www.llblgen.com/documentation/5.3/LLBLGen%20Pro%20RTF/Using%20the%20generated%20code/Adapter/gencode_prefetchpaths_adapter.htm). By adding prefetch paths, we're telling LLBLGen which related entities we want it to fetch from the database together with our main entity. These prefetched entities will be easily accessible as properties (and/or) sub-properties of the main object.

Let's take the following DB schema as an example (diagram made using [QuickDBD](https://www.quickdatabasediagrams.com/)):

![SQL Schema](sql-schema.jpg)

The code below contains two simple examples of prefetching based on two different starting points (with OrderEntity and then CustomerEntity as the starting entity).

In the first example we're prefetching multiple entity types related to the OrderEntity (CustomerEntity and ProductEntity). In the second example we're starting with the CustomerEntity, then we're prefetching all the OrderEntity objects and then multiple sub-entities related to the already prefetched OrderEntity (ProductEntity and OrderStatusEntity).

```cs
// Fetch OrderEntity with two associated nested entity types (CustomerEntity and ProductEntity)
var order = new OrderEntity(orderId);

var prefetchPath = new PrefetchPath2(EntityType.OrderEntity);
prefetchPath.Add(OrderEntity.PrefetchPathCustomer);
prefetchPath.Add(OrderEntity.PrefetchPathProduct);

using(var adapter = new DataAccessAdapter())
{
    adapter.FetchEntity(order, prefetchPath);
}


// Fetch CustomerEntity with associated nested entities of Order type and subnested OrderStatusEntity
// and ProductEntity entities (which are in turn related to the OrderEntity)
var customer = new CustomerEntity(customerId);

var prefetchPath = new PrefetchPath2(EntityType.CustomerEntity);
var orderPrefetchPath = prefetchPath.Add(CustomerEntity.PrefetchPathOrder);
orderPrefetchPath.SubPath.Add(OrderEntity.PrefetchPathOrderStatus)
orderPrefetchPath.SubPath.Add(OrderEntity.PrefetchPathProduct)

using(var adapter = new DataAccessAdapter())
{
    adapter.FetchEntity(customer, prefetchPath);
}
```

I envisioned this as a short [series of blog posts](/2017/10/23/llblgen-pro-basics/) focusing on fetching and filtering concepts which you'll find yourself using every day with LLBLGen. In the following posts we'll cover a couple of different filtering techniques depending on what you need to filter your entity collections by.

Hope you found the post helpful. If you have any questions, drop a comment bellow. Cheers!