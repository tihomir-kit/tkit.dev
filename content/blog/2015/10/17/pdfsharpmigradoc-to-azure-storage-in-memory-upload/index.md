---
title: PdfSharp / MigraDoc to Azure Storage in-memory upload
date: "2015-10-17T00:00:00.000Z"
description: This blog post explains how to create a PDF in-memory and upload it straight to Azure Storage.
featuredImage: /assets/featured/microsoft-azure.png
commentsUrl: https://github.com/pootzko/tkit.dev/issues/31
tags: [".net", "azure", "cloud", "migradoc", "pdfsharp", "upload"]
---

From my (somewhat limited) experience [PdfSharp/MigraDoc](http://www.pdfsharp.net/) seems like a pretty fine and powerful library for creating .pdf documents, but it's [documentation](http://www.pdfsharp.net/wiki/PDFsharpSamples.ashx) - not so much. It's [a bit all over the place](http://pdfsharp.com/PDFsharp/) and with multiple different NuGet versions/builds and outdated StackOverflow code samples not really helping the situation.

However, creating a .pdf document in-memory and uploading it straight to Azure is not really that complicated. When might this be useful? For example when you need to generate a report but instead of immediately giving it to the user it just needs to get stored for later access.

Magic word we're looking for is `MemoryStream`. We'll use two classes - one which will take a `MemoryStream` and upload it to Azure (`AzureProvider.cs`), and another one which will create a very simple MigraDoc document (`ReportProvider.cs`) which you can then build upon and then feed that document to the `AzureProvider` in the form of `MemoryStream`.

The code is pretty straightforward and looks like this:

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

```cs
// ReportProvider.cs

using System.IO;
using System.Threading.Tasks;
using MigraDoc.DocumentObjectModel;
using MigraDoc.Rendering;
using PdfSharp.Pdf;

namespace MyApp.Providers
{
    public class ReportProvider
    {
        protected AzureProvider _azureProvider;

        public ReportProvider()
        {
            _azureProvider = new AzureProvider();
        }

        public async Task<string> CreateReport()
        {
            var document = CreateDocument();
            var containerName = "democontainer";
            var fileName = "demodocument.pdf";
            var stream = ConvertMemDocToMemoryStream(document);

            return await _azureProvider.UploadStreamToAzure(containerName, fileName, stream);
        }

        private Document CreateDocument()
        {
            Document document = new Document();
            var section = document.AddSection();
            var paragraph = section.AddParagraph("Report Demo");

            // Add other document elements here

            return document;
        }

        protected static MemoryStream ConvertMemDocToMemoryStream(Document document)
        {
            PdfDocumentRenderer pdfRenderer = new PdfDocumentRenderer(false, PdfFontEmbedding.Always);
            pdfRenderer.Document = document;
            pdfRenderer.RenderDocument();
            MemoryStream stream = new MemoryStream();
            pdfRenderer.PdfDocument.Save(stream, false);
            return stream;
        }
    }
}
```

Somewhat related - in the next post I'll explain how to stream a file from Azure Storage private container through .net WebAPI to an AngularJS app.