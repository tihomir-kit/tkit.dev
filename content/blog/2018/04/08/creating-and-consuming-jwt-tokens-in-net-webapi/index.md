---
title: Creating and consuming JWT tokens in .Net WebAPI
date: "2018-04-08T00:00:00.000Z"
description: How to create and consume (read) JWT tokens in .Net WebAPI?
featuredImage: /assets/featured/jwt.png
commentsUrl: https://github.com/pootzko/tkit.dev/issues/3
tags: [".net", "c#", "identity", "jwt", "owin", "security", "token"]
seoKeywords: [".net", "c#", "jwt", "owin", "security", "token", "bearer", "tutorial", "guide", "identity", "user"]
---

In this post I'll explain how to create and consume the [JWT tokens](https://jwt.io/) in .Net WebAPI. I'm using this in an OWIN-based WebAPI project under .Net v4.6.1. If you're using .Net Core instead - the token generation will probably be the same, but the way of consuming it might differ slightly because of differences between the classic and Core middleware API's. I used the official Microsoft [Microsoft.Owin.Security.Jwt](https://www.nuget.org/packages/Microsoft.Owin.Security.Jwt/) NuGet package. One important thing to note is that this is an alternative approach to using the default .Net bearer token.

Why use JWT anyway? Well JWT is nice because the payload part of the token (usually containing user data such as email, username or user roles) is only encoded and can be read on the client-side very easily (good auth libraries such as [Satellizer](https://github.com/sahat/satellizer) for AngularJS or [ng2-ui-auth](https://github.com/ronzeidman/ng2-ui-auth) for Angular 2+ will take care of that for you out of the box). This saves you an additional round-trip to the server which you would otherwise have to do to "load up the current user" into your SPA app.

Let's get started. The first thing we're going to need is this small extension class which we'll need both in token generation and in the middleware setup. It contains two simple string extension methods which allow us to create `SigningCredentials` and the `SymmetricSecurityKey` from a `jwtSecret` key (which should be a long string of random characters).

```cs
public static class SecurityExtensions
{
    public static SigningCredentials ToIdentitySigningCredentials(this string jwtSecret)
    {
        var symmetricKey = jwtSecret.ToSymmetricSecurityKey();
        var signingCredentials = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha256);

        return signingCredentials;
    }

    public static SymmetricSecurityKey ToSymmetricSecurityKey(this string jwtSecret)
    {
        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
    }
}
```

Now let's move on the the most important part, the class which actually creates the token - `JwtTokenProvider`. You would typically use this provider from your `AccountController` in actions such as `Login` or `SocialAuth` after you've successfully authenticated the user. In your `Login` action, simply swap the old code which you might have that generates the default bearer token, and return the newly created JWT token instead (only if the user has been successfully authenticated of course!).

The client-side will then need to properly store the token and use it in each request that requires authentication (the typical way of handling this is by setting the token as the value of the `Authorization` header for each request via some sort of request interceptor).

Also, if you're using dependency injection, you'll have to add the `IJwtTokenProvider` interface yourself. To simplify the post and to concentrate on the most important bits to JWT token creation, I left that part out on purpose. If you're not using DI, simply instantiate the provider class and create the token.

```cs
public class JwtTokenProvider
{
    // Ideally, you should put these to into your config file
    private readonly string _appDomain = "yourdomain.com";
    private readonly string _jwtSecret = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";

    /// <summary>
    /// Creates a JSW Bearer token for the user.
    /// </summary>
    /// <see cref="https://jwt.io/"/>
    /// <see cref="https://jonhilton.net/2017/10/11/secure-your-asp.net-core-2.0-api-part-1---issuing-a-jwt/"/>
    /// <see cref="http://bitoftech.net/2014/08/11/asp-net-web-api-2-external-logins-social-logins-facebook-google-angularjs-app/"/>
    /// <param name="user">User model.</param>
    /// <returns>A JWT bearer token.</returns>
    public string GenerateAccessToken(UserModel user)
    {
        var jwtSecurityToken = new JwtSecurityToken
        (
            issuer: _appDomain,
            audience: _appDomain,
            claims: CreateClaims(user),
            // Set expiry to whatever suits you, or implement short-lived
            // sliding-tokens for better security
            expires: DateTime.UtcNow.Add(TimeSpan.FromDays(7)),
            signingCredentials: _jwtSecret.ToIdentitySigningCredentials()
        );

        var token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);

        return token;
    }

    /// <summary>
    /// Creates a collection of claims based on the the current user.
    /// </summary>
    /// <param name="user">UserModel which describes the current user.</param>
    /// <returns>A collection of Claims for the JWT token.</returns>
    private IEnumerable<Claim> CreateClaims(UserModel user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            // Add any aditional claims here
        };

        if (user.Roles != null)
        {
            foreach (var role in user.Roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }
        }

        return claims;
    }
}
```

Also, here is the simple `UserModel` that was used in the `JwtTokenProvider`. Feel free to extend it to your needs.

```cs
public class UserModel
{
    /// <summary>
    /// User Id.
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Username.
    /// </summary>
    public string Username { get; set; }

    /// <summary>
    /// User email.
    /// </summary>
    public string Email { get; set; }

    /// <summary>
    /// List of user roles the user belongs to.
    /// </summary>
    public IEnumerable<string> Roles { get; set; }
}
```

Now, to glue all of this together and to enable the WebAPI to read (decrypt and decode) the tokens on each request, we need to tell the middleware how to do it. You can add this piece of code to your _Startup.cs_ or even better, extract this code into a separate method inside _App_Start/AuthConfig.cs_ and then just call it from the _Startup.cs_.

```cs
// The app variable is of Owin.IAppBuilder type
app.UseJwtBearerAuthentication(new JwtBearerAuthenticationOptions
{
    TokenValidationParameters = new TokenValidationParameters
    {
        // The same _jwtSecret and _appDomain as in JwtTokenProvider were used here
        IssuerSigningKey = _jwtSecret.ToSymmetricSecurityKey(),
        ValidIssuer = _appDomain,
        ValidAudience = _appDomain,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(0)
    }
});
```

After this, all the `[Authorize]` attributes you had previously should continue working as before when you were still using the default bearer token. You should also be able to access the current user using for example `HttpContext.Current.User.Identity` from within your controller actions.

In one of the upcoming posts I'll demonstrate a neat technique to share the current user context vertically between all your app layers (such as the business layer and/or repository) - something that you can't do using the `HttpContext` because you don't really want to have all the "web" dll's in your lower layers, they should stay clean and agnostic.

<!-- If you have any questions or comments, leave them below. Thnx! -->
