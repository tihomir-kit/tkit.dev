---
title: Accessing localhost .Net Core WebAPI from a Docker container
date: "2020-03-07T00:00:00.000Z"
description: How to access a development (localhost) instance of a .Net Core WebAPI from a Docker container?
featuredImage: /assets/featured/docker.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/7
tags: ["dotnet", "core", "webapi", "docker", "networking"]
seoKeywords: ["dotnet", "core", "webapi", "docker", "networking"]
---

In days of .Net Framework, I used to run .Net web apps using IIS. Create a new website in IIS, point it to the web project folder, set the app pool, add an entry to `hosts` file and you're good. Others could also access it over the local network.

With .Net Core I started using IIS Express, and it served me well until I tried accessing it from a Docker container. I kept getting `HTTP 400 - Bad Request` even though I used the [special DNS](https://docs.docker.com/docker-for-windows/networking/#use-cases-and-workarounds) `host.docker.internal` from inside the container.

Turns out IIS Express doesn't support access from outside the box (which is the situation we have with the Docker container, I should have known this in advance!) without applying some [additional modifications](https://blog.kloud.com.au/2017/02/27/remote-access-to-local-aspnet-core-apps-from-mobile-devices/) to your OS and Visual Studio.

I personally sorted this out by running the WebAPI using the [Kestrel server](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel) instead of IIS Express. It is the simpler solution for now and I have no issues with running the app using Kestrel. The setup in my case was very simple. I added the following two entries to my `launchSettings.json`:

```json
{
  "Kestrel": {
    "commandName": "Project",
    "launchBrowser": true,
    "applicationUrl": "https://localhost:44313;http://localhost:26628",
    "environmentVariables": {
      "ASPNETCORE_ENVIRONMENT": "Development"
    }
  },
  "Kestrel Watch": {
    "executablePath": "dotnet.exe",
    "workingDirectory": "$(ProjectDir)",
    "commandLineArgs": "watch run",
    "launchBrowser": true,
    "applicationUrl": "https://localhost:44313;http://localhost:26628",
    "environmentVariables": {
      "ASPNETCORE_ENVIRONMENT": "Development"
    }
  },
}
```

And that was it, I was able to access the WebAPI from the Docker container after that.

And here are 2 extra videos which explain in and out of process hosting in .Net Core WebAPI. They are related and you might find them useful:

 - https://www.youtube.com/watch?v=ydR2jd3ZaEA
 - https://www.youtube.com/watch?v=QsXsOX6qq2c