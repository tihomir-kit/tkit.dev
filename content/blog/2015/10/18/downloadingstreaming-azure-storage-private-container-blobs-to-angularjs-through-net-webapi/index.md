---
title: Downloading / Streaming Azure Storage private container blobs to AngularJS through .Net WebAPI
date: "2015-10-18T00:00:00.000Z"
description: This article explains how to stream private Azure Storage blobs through .Net WebAPI for usage in AngularJS apps.
featuredImage: /assets/featured/dot-net.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/30
tags: ["dotnet", "angularjs", "azure", "cloud", "storage", "webapi"]
---

_UPDATE: Since this blog article was written, there is now a better way to handle this - [Shared Access Signatures (SAS)](https://docs.microsoft.com/en-us/azure/storage/common/storage-sas-overview)_.

When our Azure storage contains files that are meant to be publicly accessible, it's pretty trivial to deliver them to the end-user. We can either embed such items (e.g. images) or simply add links which point to them (e.g. PDF's) because Azure provides direct links to them. But what happens when these files contain sensitive data that is not meant for just anyone? Perhaps some kind of reports?

Well, it gets a bit more complicated.. Since these files don't have publicly accessible URI's any more, there are several steps which we need to go through:

- Authenticate against Azure using SDK
- Load the file into `MemoryStream`
- Deliver the stream to the client (browser)
- Convert the byte array into an actual file on the client-side and simulate "downloading"

Since we'll need more than just the `MemoryStream`, we'll wrap it together with the file metadata into a model object.

```cs
// AzureBlobModel.cs

using System.IO;

namespace MyApp.Models
{
    public class AzureBlobModel
    {
        public string FileName { get; set; }

        public long? FileSize { get; set; }

        public Stream Stream { get; set; }

        public string ContentType { get; set; }
    }
}
```

We will use `AzureProvider` class to authenticate against Azure, download the file from Azure and to create the model object.

```cs
// AzureProvider.cs

using System;
using System.Configuration;
using System.IO;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Blob;

namespace MyApp.Providers
{
    public class AzureProvider
    {
        public async Task<AzureBlobModel> GetAzureBlob(string containerName, string fileName)
        {
            var cloudBlockBlob = ResolveCloudBlockBlob(containerName, fileName);
            var stream = await cloudBlockBlob.OpenReadAsync();

            var blob = new AzureBlobModel()
            {
                FileName = fileName,
                FileSize = cloudBlockBlob.Properties.Length,
                Stream = stream,
                ContentType = cloudBlockBlob.Properties.ContentType
            };

            return blob;
        }

        public async Task<string> UploadStreamToAzure(string containerName, string fileName, MemoryStream stream)
        {
            var blockBlob = ResolveCloudBlockBlob(containerName, fileName);
            await blockBlob.UploadFromStreamAsync(stream);
            return fileName;
        }

        public CloudBlockBlob ResolveCloudBlockBlob(string containerName, string fileName)
        {
            var container = ResolveCloudBlobContainer(containerName);
            var blockBlob = container.GetBlockBlobReference(fileName);
            return blockBlob;
        }

        public CloudBlobContainer ResolveCloudBlobContainer(string containerName)
        {
            var storageAccount = GetCloudStorageAccount();
            var blobClient = storageAccount.CreateCloudBlobClient();
            var container = blobClient.GetContainerReference(containerName);
            return container;
        }

        private CloudStorageAccount GetCloudStorageAccount()
        {
            return CloudStorageAccount.Parse(ResolveAzureStorageConnectionString());
        }

        public string ResolveAzureStorageConnectionString()
        {
            var accountName = ConfigurationManager.AppSettings["Azure.Storage.AccountName"]; // Get account name from web.config
            var accessKey = ConfigurationManager.AppSettings["Azure.Storage.PrimaryAccessKey"]; // Get primary access key from web.config
            return String.Format("DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1}", accountName, accessKey);
        }
    }
}
```

Our actual controller will inherit from this `BaseApi` class which contains a custom `IHttpActionResult` method which we can name `AzureBlobOk`. This is something pretty reusable so it's good to have it at hand in your base class. What it does is it sets up all the content headers and it attaches the stream as the response content payload . It also returns HTTP status 200 which means OK - everything went fine.

```cs
// BaseApiController.cs

using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web.Http;
using MyApp.Models;

namespace MyApp.Infrastructure
{
    public class BaseApiController : ApiController
    {
        /// <summary>
        /// Returns HTTP status 200 (OK) when user tries to fetch private Azure blob through the backend/WebAPI.
        /// </summary>
        /// <param name="azureBlob">Azure Blob Model.</param>
        /// <returns>Action result.</returns>
        protected IHttpActionResult AzureBlobOk(AzureBlobModel azureBlob)
        {
            var response = Request.CreateResponse(HttpStatusCode.OK);
            response.Content = new StreamContent(azureBlob.Stream);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue(azureBlob.ContentType);
            response.Content.Headers.Add("x-filename", azureBlob.FileName);
            response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment");
            response.Content.Headers.ContentDisposition.FileName = azureBlob.FileName;
            response.Content.Headers.ContentDisposition.Size = azureBlob.FileSize;

            return ResponseMessage(response);
        }
    }
}
```

The actual controller is pretty simple..

```cs
// ReportsController.cs

using System.Web.Http;
using System.Threading.Tasks;

namespace MyApp.Controllers.API
{
    [RoutePrefix("api/reports")]
    public class ReportsController : BaseApiController
    {
        private AzureProvider _azureProvider;

        public ReportsController()
        {
            _azureProvider = new AzureProvider();
        }

        [Route("sampleReport/{fileName}")]
        public async Task<IHttpActionResult> GetSampleReport(string fileName)
        {
            var containerName = "democontainer";
            var report = await _azureProvider.GetAzureBlob(containerName, fileName);

            return AzureBlobOk(report);
        }
    }
}
```

On the client side, we'll need the following service to actually convert the byte array that we got from the API into something meaningful. I tried various approaches, but in the end decided to use [FileSaver.js](https://github.com/eligrey/FileSaver.js) which _"implements the HTML5 W3C saveAs() FileSaver interface in browsers that do not natively support it"_. What it will do is turn the byte array into an actual file and prompt the user to download it.

```js
// azure-blob-download.service.js

(function () {
    "use strict";

    angular
        .module("MyApp.Common")
        .service("AzureBlobDownloadService", AzureBlobDownloadService);

    AzureBlobDownloadService.$inject = ["$http", "$log"];
    function AzureBlobDownloadService($http, $log) {
        // Example call from an angular controller (AzureBlobDownloadService obviously needs to be injected):
        // AzureBlobDownloadService.getBlob("/api/reports/sampleReport", { fileName: "someFileName" });
        // NOTE: you should set the fileName through angular $http params instead of directly
        // putting it into the url to avoid having problems with the dot (".") character ž
        // in the url of your WebAPI call
        this.getBlob = function (url, params) {
            return $http.get(url, {
                cache: false,
                responseType: "arraybuffer",
                headers: {
                    "Content-Type": "application/octet-stream; charset=utf-8"
                },
                params: params
            }).success(function (data, status, headers) {
                var octetStreamMime = "application/octet-stream";
                headers = headers();
                var fileName = !!headers["x-filename"] ? decodeURIComponent(escape(headers["x-filename"])) : "download.pdf";
                var contentType = headers["content-type"] || octetStreamMime;

                try {
                    var blob = new Blob([data], { type: contentType });
                    saveAs(blob, fileName);
                } catch (ex) {
                    $log.error("Simulated download is not supported by your browser.");
                    $log.error(ex);
                }
            });
        }
    }
})();
```

This service can easily be consumed by injecting it into your AngularJS controllers and calling the `.getBlob()` function which will do all the heavy lifting for you.

Hope this helped, enjoy! :)
