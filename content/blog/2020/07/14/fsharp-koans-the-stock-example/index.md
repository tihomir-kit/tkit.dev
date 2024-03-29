---
title: F# Koans - The Stock Example
date: "2020-07-14T00:00:00.000Z"
description: My early attempt on functional programming in F# - solving one of the F# Koans exercises.
featuredImage: /assets/featured/fsharp.png
commentsUrl: https://github.com/tihomir-kit/tkit.dev/issues/48
tags: ["fsharp", "koans", "functional", "programming", "exercise"]
---

I'm currently in the process of learning functional programming and it feels like being back in my teens
and discovering programming for the first time.. again. :) I've been going through
[F# Koans](https://github.com/ChrisMarinos/FSharpKoans) and this was the first exercise that took me
a little more than no time to complete. It felt good to do it so I thought I'd share my solution.

```fsharp
namespace FSharpKoans
open FSharpKoans.Core
open System

//---------------------------------------------------------------
// Apply Your Knowledge!
//
// Below is a list containing comma separated data about
// Microsoft's stock prices during March of 2012. Without
// modifying the list, programatically find the day with the
// greatest difference between the opening and closing prices.
//
//---------------------------------------------------------------
[<Koan(Sort = 15)>]
module ``about the stock example`` =

    let stockData =
        [ "Date,Open,High,Low,Close,Volume,Adj Close";
          "2012-03-30,32.40,32.41,32.04,32.26,31749400,32.26";
          "2012-03-29,32.06,32.19,31.81,32.12,37038500,32.12";
          "2012-03-28,32.52,32.70,32.04,32.19,41344800,32.19";
          "2012-03-27,32.65,32.70,32.40,32.52,36274900,32.52";
          "2012-03-26,32.19,32.61,32.15,32.59,36758300,32.59";
          "2012-03-23,32.10,32.11,31.72,32.01,35912200,32.01";
          "2012-03-22,31.81,32.09,31.79,32.00,31749500,32.00";
          "2012-03-21,31.96,32.15,31.82,31.91,37928600,31.91";
          "2012-03-20,32.10,32.15,31.74,31.99,41566800,31.99";
          "2012-03-19,32.54,32.61,32.15,32.20,44789200,32.20";
          "2012-03-16,32.91,32.95,32.50,32.60,65626400,32.60";
          "2012-03-15,32.79,32.94,32.58,32.85,49068300,32.85";
          "2012-03-14,32.53,32.88,32.49,32.77,41986900,32.77";
          "2012-03-13,32.24,32.69,32.15,32.67,48951700,32.67";
          "2012-03-12,31.97,32.20,31.82,32.04,34073600,32.04";
          "2012-03-09,32.10,32.16,31.92,31.99,34628400,31.99";
          "2012-03-08,32.04,32.21,31.90,32.01,36747400,32.01";
          "2012-03-07,31.67,31.92,31.53,31.84,34340400,31.84";
          "2012-03-06,31.54,31.98,31.49,31.56,51932900,31.56";
          "2012-03-05,32.01,32.05,31.62,31.80,45240000,31.80";
          "2012-03-02,32.31,32.44,32.00,32.08,47314200,32.08";
          "2012-03-01,31.93,32.39,31.85,32.29,77344100,32.29";
          "2012-02-29,31.89,32.00,31.61,31.74,59323600,31.74"; ]

    let splitCommas (x:string) =
        x.Split([|','|])

    let findColumnIndex data key =
        data
        |> List.head
        |> splitCommas
        |> Array.findIndex ((=) key)

    let parseDailyData data =
        data
        |> List.tail
        |> List.map splitCommas

    let getDailyDiffs data =
        let dateIndex = findColumnIndex data "Date"
        let openIndex = findColumnIndex data "Open"
        let closeIndex = findColumnIndex data "Close"
        let diff x y = abs(Double.Parse(x) - Double.Parse(y))

        data
        |> parseDailyData
        |> List.map (fun x -> (x.[dateIndex], diff x.[closeIndex] x.[openIndex]))

    let getMaxDailyDiff data =
        data
        |> getDailyDiffs
        |> List.maxBy (fun (_, x) -> x)

    [<Koan>]
    let YouGotTheAnswerCorrect() =
        let result, _ = getMaxDailyDiff stockData

        AssertEquality "2012-03-13" result
```

Being a complete F# newbie, I'd like you to share your solution or opinion in the comments.

How can I improve this? Thanks!