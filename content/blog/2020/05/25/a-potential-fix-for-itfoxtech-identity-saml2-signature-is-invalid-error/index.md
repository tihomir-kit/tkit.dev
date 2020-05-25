---
title: A potential fix for ITfoxtech.Identity.Saml2 "Signature is invalid" error
date: "2020-05-25T00:00:00.000Z"
description: This article will cover one of the potential reasons why you're getting the invalid signature error when you're trying to authenticate against and IDP.
featuredImage: /assets/featured/dot-net-hex.jpg
commentsUrl: https://github.com/pootzko/tkit.dev/issues/47
tags: ["saml2", "signature", "mini orange", "itfoxtech", "algorithm", "hashing"]
---

I've encountered this issue twice already so I thought I'd write it down this time in case I need it again. The requirement was to set up Saml2 authentication against [mini Orange SAML IDP WP plugin](https://wordpress.org/plugins/miniorange-wp-as-saml-idp/). As far as .Net libraries go, the [ITfoxtech.Identity.Saml2 library](https://www.itfoxtec.com/identitysaml2) seemed pretty solid so I went with that.

After a bit of reading and figuring out how to integrate these two things, I thought I did everything right but I kept getting the "Signature is invalid" error on this line:

```cs
binding.Unbind(Request.ToGenericHttpRequest(), saml2AuthnResponse);
```

The issue in my case was the wrong Saml2.SignatureAlgorithm config option. I had `http://www.w3.org/2001/04/xmldsig-more#rsa-sha256` which was wrong, and I had to change it to a different algorithm.

An easy way to figure out which hashing algorithm has been used by your IDP (I didn't know because I wasn't in charge of setting up the mini Orange IDP) is to capture the whole SAML payload at the `.Unbind()` line. Depending whether your setup is using GET query params or POST body payload, you'll find it in at a different place, but just drill down the `Request` property, and you'll find it in there somewhere. After that, copy the payload and decode it using a tool such as [this one](https://toolbox.googleapps.com/apps/encode_decode/). Select the "SAML decode" and the payload should decode into an XML document. Now search for "w3.org" and you should see the hashing algorithm that was used. The last thing to do is to update your ITfoxtech configuration and it should start working if you got everything else right.

Additional links that might be useful:

- https://stackoverflow.com/questions/58603633/invalidsignatureexception-signature-is-invalid
- https://github.com/ITfoxtec/ITfoxtec.Identity.Saml2/issues/10