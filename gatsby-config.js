const path = require("path");

module.exports = {
  siteMetadata: {
    title: "TKIT_dev",
    author: {
      name: "Tihomir Kit",
    },
    description: "to understand what recursion is, you must first understand recursion",
    siteUrl: "https://tkit.dev/",
    social: {
      twitter: "pootzko",
      github: "pootzko",
    },
  },
  plugins: [
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/content/assets`,
        name: "assets",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/content/blog`,
        name: "blog",
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          `gatsby-remark-relative-images`,
          // {
          //   resolve: `gatsby-remark-relative-images`,
          //   options: {
          //     // [Optional] The root of "media_folder" in your config.yml
          //     // Defaults to "static"
          //     staticFolderName: 'assets',
          //     // [Optional] Include the following fields, use dot notation for nested fields
          //     // All fields are included by default
          //     // include: ['featuredImage'],
          //     // [Optional] Exclude the following fields, use dot notation for nested fields
          //     // No fields are excluded by default
          //     // exclude: ['featured.skip'],
          //   },
          // },
          {
            resolve: "gatsby-remark-images",
            options: {
              maxWidth: 780,
            },
          },
          {
            resolve: "gatsby-remark-responsive-iframe",
            options: {
              wrapperStyle: "margin-bottom: 1.0725rem", // TODO: maybe resolve this through typography file
            },
          },
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              showLineNumbers: true,
            },
          },
          "gatsby-remark-copy-linked-files",
          "gatsby-remark-smartypants",
        ],
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-sharp",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-11297782-1",
      },
    },
    "gatsby-plugin-feed",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Tihomir Kit dev blog",
        short_name: "TKIT_dev",
        start_url: "/",
        background_color: "#ffffff",
        theme_color: "#663399",
        display: "minimal-ui",
        icon: "content/assets/favicon.png",
      },
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-typography",
      options: {
        pathToConfigModule: "src/utils/typography",
      },
    },
    {
      resolve: "gatsby-plugin-alias-imports",
      options: {
        alias: {
          "@assets": `${__dirname}/content/assets`,
        },
        extensions: [],
      },
    },
    "gatsby-plugin-typescript",
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        cssLoaderOptions: {
          esModule: false,
          modules: {
            namedExport: false,
          },
        },
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // "gatsby-plugin-offline",
    {
      resolve: `gatsby-plugin-emotion`,
      options: {
        // Accepts the following options, all of which are defined by `@emotion/babel-plugin` plugin.
        // The values for each key in this example are the defaults the plugin uses.
        sourceMap: true,
        autoLabel: "dev-only",
        labelFormat: `[local]`,
        cssPropOptimization: true,
      },
    },
  ],
};
