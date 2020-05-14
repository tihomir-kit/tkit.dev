---
title: Loading embedded resource images into PdfSharp/MigraDoc for non-web projects layers
date: "2015-12-13T00:00:00.000Z"
description: How to add a solution resource image file into PdfSharp/MigraDoc?
featuredImage: /assets/featured/dot-net-hex.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/22
tags: [".net", "azure", "migradoc", "pdfsharp"]
---

There are some cases (for example on Azure) when you can't really rely on ASP's Web-layer file resources or "server paths" and file management libraries to access your static resource files. For example if you have a business layer which doesn't really have a direct access to another layer's files but you need to generate a PDF using [PdfSharp/MigraDoc](http://www.pdfsharp.net/) inside that layer.

How it can be done is - you need to add an image file to your layer, then right-click on it and go to it's properties. There you need to set the "Build Action" to _Embedded Resource_, and the "Copy to Output Directory" to _Copy if newer_. After that, use these three simple methods to load up the image from the assembly into a _Stream_, convert it to a _byte[]_ array and then encode it as a base64 string.

```cs
// MigraDocProvider.cs

/// <summary>
/// Gets "Assembly Resource" image encoded as base64 string (which MigraDoc knows how to
/// handle), ready to be consumed by MigraDoc components. Images are located in ~/Resources/images/*
/// and they need to be marked as "Embedded Resource" and set to "Copy if newer".
/// </summary>
/// <see cref="http://pdfsharp.net/wiki/MigraDoc_FilelessImages.ashx"/>
/// <param name="imageName">Image Assembly Resource name.</param>
/// <returns></returns>
protected string GetMigraDocImage(string imageName)
{
    // Add your namespace + project path to the image you want to embed
    var assemblyResourceName = String.Format("Your.Layer.Namespace.Resources.images.{0}", imageName);
    var image = LoadAssemblyImage(assemblyResourceName);
    var imageFilename = ConvertToMigraDocFilename(image);

    return imageFilename;
}

/// <summary>
/// Loads assembly image from the project and converts it to a byte array.
/// </summary>
/// <see cref="http://pdfsharp.net/wiki/MigraDoc_FilelessImages.ashx"/>
/// <param name="name">Assembly File Name.</param>
/// <returns>Image data array.</returns>
private byte[] LoadAssemblyImage(string name)
{
    var assembly = Assembly.GetExecutingAssembly();
    using (Stream stream = assembly.GetManifestResourceStream(name))
    {
        if (stream == null)
            throw new ArgumentException("No resource with name " + name);

        int count = (int)stream.Length;
        byte[] data = new byte[count];
        stream.Read(data, 0, count);
        return data;
    }
}

/// <summary>
/// Converts image data array to base64 string. Used for integrating images into MigraDoc PDF's.
/// </summary>
/// <see cref="http://pdfsharp.net/wiki/MigraDoc_FilelessImages.ashx"/>
/// <param name="image">Image data array.</param>
/// <returns>Image as base64 string.</returns>
protected string ConvertToMigraDocFilename(byte[] image)
{
    return String.Format("base64:{0}", Convert.ToBase64String(image));
}
```

By using the _base64_ representation of the image, [you will be able](http://pdfsharp.net/wiki/MigraDoc_FilelessImages.ashx) to embed it into your PDF document.

Cheers!