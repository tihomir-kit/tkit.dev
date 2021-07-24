const path = require("path");
const _ = require("lodash");
const { createFilePath } = require("gatsby-source-filesystem");
const { fmImagesToRelative } = require("gatsby-remark-relative-images");

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;

  const blogPost = path.resolve("./src/templates/blog-post.tsx");
  const blogList = path.resolve(`./src/templates/blog-list.tsx`);
  const tagTemplate = path.resolve(`./src/templates/tags.tsx`);

  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title
                tags
              }
            }
          }
        }
      }
    `,
  );

  if (result.errors) {
    throw result.errors;
  }

  // Create blog posts pages.
  const posts = result.data.allMarkdownRemark.edges;

  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;

    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
        tag: post.node.frontmatter.tags,
      },
    });
  });

  // Create blog post list pages
  const postsPerPage = 5;
  const numPages = Math.ceil(posts.length / postsPerPage);

  Array.from({ length: numPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/page/1` : `/page/${i + 1}`,
      component: blogList,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage: i + 1,
      },
    });
  });

  // Tag pages:
  let tags = [];
  // Iterate through each post, putting all found tags into `tags`
  _.each(posts, edge => {
    if (_.get(edge, 'node.frontmatter.tags')) {
      tags = tags.concat(edge.node.frontmatter.tags);
    }
  });
  // Eliminate duplicate tags
  tags = _.uniq(tags);

  // Make tag pages
  tags.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag)}/`,
      component: tagTemplate,
      context: {
        tag,
      },
    });
  });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // OLD Code, keep for reference for a while
  // if (node.internal.type === "MarkdownRemark") {
  //   const value = createFilePath({ node, getNode });
  //   createNodeField({
  //     name: "slug",
  //     node,
  //     value,
  //   });
  // }

  if (node.internal.type === "MarkdownRemark") {
    const value = createFilePath({ node, getNode });
    // TODO: Debug this value, see if code can be reduced
    createNodeField({
      name: "slug",
      node,
      value: typeof node.frontmatter.slug !== 'undefined' ? node.frontmatter.slug : value,
    });
  }

  fmImagesToRelative(node);
};

// DO NOT UPGRADE gatsby-remark-relative-images
// SEE: https://stackoverflow.com/a/63714936/413785
// Potential solution: https://stackoverflow.com/a/58398170/413785 (but it's messed up, didn't work the first time)
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }

    type Frontmatter @infer {
      featuredImage: File @fileByRelativePath,
    }
  `;

  createTypes(typeDefs);
};

// SEE: https://github.com/gatsbyjs/gatsby/issues/4357#issuecomment-445458658
exports.onCreateWebpackConfig = function({ actions }) {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
      fallback: {
        fs: false,
      }
    },
  });
};

// TODO: Merge with the above?
// for React-Hot-Loader: react-🔥-dom patch is not detected
exports.onCreateWebpackConfig = ({ getConfig, stage }) => {
  const config = getConfig();
  if (stage.startsWith('develop') && config.resolve) {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom',
    };
  }
}

