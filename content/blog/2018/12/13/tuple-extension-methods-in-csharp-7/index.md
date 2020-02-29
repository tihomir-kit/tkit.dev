---
title: Tuple extension methods in C#7
date: "2018-12-13T00:00:00.000Z"
description: Working with tuples and extensions in C#7
tags: [".net", "c#"]
featuredImage: /assets/featured/dot-net-hex.jpg
---

Tuples allow us to package more than one value as the return type of a method. This is very handy when we don’t want to create an additional data transfer object just to return an extra piece of data together with the main value/object we want to return.

A perfect example in my opinion of when this is useful is when we want to return a partial (paged/filtered) collection of entities from the database and at the same time return the total amount of entities that are in the db. The code snippet below does that for database user entities.

After fetching a part of records from the db table, and fetching the total count, I often build what I call a generic PagedCollection object which contains the collection of filtered objects, total count of records in the database, the page count which gets calculated based on the filter params (page size) passed from the client-side and I also like to add the currently requested page number into the mix. This way I have everything I need to bind this “page of data” with a grid component on the client-side.

```cs
// Extension method definition
public static PagedCollection<TResult> ToPagedCollection<T, TResult>(
    this (IEnumerable<T> entitiesToMap, int totalCount) entitiesAndCount, // This is the important bit
    FilterParameters filterParameters,
    Func<T, TResult> map)
{
    return entitiesAndCount.entitiesToMap.ToPagedCollection(entitiesAndCount.totalCount, filterParameters?.PagingParameters?.PageSize, map);
}

// Consumption of the extension method
public async Task<PagedCollection<User>> FilterUsersAsync(FilterParameters filter)
{
    var bucket = filter.BuildSearchPredicateBucket(AspNetUserFields.Email);
    var prefetch = CreateUserRolesPrefetchPath();

    // Repository returns a tuple
    var entitiesAndCount = await _userRepository.FetchAndCountEntitiesAsync(filter, bucket, prefetch);

    // Tuple used as the main extension method argument
    return entitiesAndCount.ToPagedCollection(filter, UserMappingExtensions.ToModel);
}
```

In the past, although it’s not really a best practice, I would use C# out params for this specific case of getting the entity count at the same time as the collection itself and in my opinion tuples make this a bit cleaner and nicer. Another benefit of this is that tuples can be used with async methods, where out parameters can’t.
