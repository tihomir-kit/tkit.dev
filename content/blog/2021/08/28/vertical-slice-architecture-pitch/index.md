---
title: Vertical slice architecture pitch
date: "2021-08-28T00:00:00.000Z"
description: Making a case for replacing the classic n-tier architecture with vertical slice architecture.
featuredImage: /assets/featured/preach.png
commentsUrl: https://github.com/tihomir-kit/tkit.dev/issues/53
tags: ["vertical", "slice", "architecture", "infrastructure", "cqrs"]
---

For the past year I've been playing with [Jimmy Bogard's vertical slice architecture](https://jimmybogard.com/vertical-slice-architecture/) on a personal project and I became a fan. I recently recommended we start using it at work and after the initial positive feedback I was told to prepare a bit of a pitch for my co-workers. So, this will be mostly just a bunch of notes, references and personal observations to help me preach. If you find it useful, great! If you have anything to add or object to, please leave a comment. Thanks!

Naturally, I think the best pitch really is to just watch Jimmy explain it. I'll leave these 2 videos here for your pleasure:

<iframe width="560" height="315" src="https://www.youtube.com/embed/5kOzZz2vj2o" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<iframe width="560" height="315" src="https://www.youtube.com/embed/L3SvIKdLt88" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

<br /><br />

## What we currently have (N-Tier)

In very generic terms, this is how N-Tier is typically represented (image taken from Jimmy):

![N-Tier](n-tier.png)

And this is a more detailed overview of how we currently typically structure our projects:

#### WebAPI layer

- Application bootstrapping / configuration
- Simple Authentication / Authorization through the `[Authorize]` .Net attribute
  - Ok for simple authentication / user role checks
- Simple model validation through a custom `[ValidateModelState]` controller action attribute
  - Intercepts incoming models on `OnActionExecuting()`
  - Ok for simple .Net [validation attribute](https://docs.microsoft.com/en-us/aspnet/core/mvc/models/validation?view=aspnetcore-5.0#validation-attributes) based property validation
  - Exception based
- Routing
- Global exception handler

#### Business layer

- Services
  - Business (domain) logic
  - Invocation of Entity-to-View-Model mappings
  - More complex authorization that typically requires a trip to the DB to:
    - Ensure user authorized access / modification of a resource
    - Ensure user belongs to a company
    - Ensure IP whitelisted
  - More complex model validation that might include:
    - [FluentValidation](https://fluentvalidation.net/) - More complicated validation rules that can't be accomplished using basic .Net validation attributes
    - Trips to the DB to:
      - Ensure a DB record with the same name does not already exist
      - Ensure user didn't already fulfill his allowed user space
- Providers
  - Email sender
  - SMS sender
  - 3rd party API's adapters
- Data Mappers
  - Static Entity-to-View-Model mapper classes
  - Shared domain data-mapping logic

#### Auth layer

- Common security providers
  - Complex security checks that require trips to the DB
  - Typically consumed by business layer services
- Custom auth / security infrastructure code

#### Repository layer

- Base and generic repository classes
  - Basically generic LLBLGen ORM wrapper code
- Specific repositories built on top of our `IRepository<T>` such as:
  - IUserRepository
  - ICustomerRepository
  - IOrderRepository
- Specific lookup repositories built in top our `ILookupRepository<T>` such as:
  - IProductTypeLookup
  - IUserRoleLookup

#### Core layer

- Cross-cutting (accessible by WebAPI / Business / Repository layers)
- GET models, POST/PUT models, grid filtering models
- Custom exception types
- Common extension / helper classes for primitive / basic types

## Identified issues of this structure

- Bad code re-use
- Bloated god models
- Authorization / Model validation scattered between 2 layers
- Authorization / Model validation not always unit testable
- Too many files to touch
- Files that need touching / creation not close together
  - Cognitive load
  - Time
- "Expected" exceptions are unpredictable side-effects that break code execution flow and are harder to follow, reason about and test
- Domain logic scattered
- Repository method bloat

### Typical files that need touching / creation to add a new feature

On the client-side we started grouping things by feature already



## Vertical Slice

![Vertical SLice](vertical-slice.png)




## Benefits

- Expandable with domain logic
- Microservices
- Event sourcing
- Can use different ORMS or swap them with ease, gradually
- No bloated god models, no leaks
- Auth / model validation in a single spot, easier to test
- 2 files touch
- Result<T>, Unit
- Can still do common / shared stuff if it's really shared

CQRS
- Broken rule with returned ID
LLBLGen switch from specific repositories to shared prefetch / bucket extension methods
Can be simplified even further (to remove controllers)
Use swagger / TS-gen to speed things up
Give some code sample of a typical query
Give some code sample of a typical command



https://stackoverflow.com/questions/34255490/difference-between-cqrs-vs-cqs
https://1.bp.blogspot.com/-IGCP7Sk0VPc/T4PPLwGrwvI/AAAAAAAACTE/KkkrIJk9X-Q/s400/cqsr_pattern.png
https://miro.medium.com/max/1338/1*_3fNTp9Jz59yao-YusKcGQ.png
https://i.stack.imgur.com/yZmDz.png