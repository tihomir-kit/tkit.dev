// import React from "react";
// import { graphql } from "gatsby";
// import { css } from "@emotion/react";

// import { rhythm } from "@/utils";
// import { Layout, SEO, ItemHeading, Bio } from "@/components";

// const excerptStyle = css`
//   margin-bottom: ${rhythm(1.75)};
// `;

// // TODO: use a type instead of any
// const BlogIndex = ({ data, location }: any) => {
//   const siteTitle = data.site.siteMetadata.title;
//   const posts = data.allMarkdownRemark.edges;

//   return (
//     <Layout location={location} title={siteTitle}>
//       <SEO title="Tihomir Kit - Dev blog" />
//       <Bio />
//       {posts.map(({ node }: any) => {
//         return (
//           <article key={node.fields.slug}>
//             <ItemHeading
//               heading={node.frontmatter.title || node.fields.slug}
//               subHeading={node.frontmatter.date}
//               to={node.fields.slug}
//             />
//             <section>
//               <p
//                 css={excerptStyle}
//                 dangerouslySetInnerHTML={{
//                   __html: node.frontmatter.description || node.excerpt,
//                 }}
//               />
//             </section>
//           </article>
//         );
//       })}
//     </Layout>
//   );
// };

// export default BlogIndex;

// export const pageQuery = graphql`
//   query {
//     site {
//       siteMetadata {
//         title
//       }
//     }
//     allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
//       edges {
//         node {
//           excerpt
//           fields {
//             slug
//           }
//           frontmatter {
//             date(formatString: "MMMM DD, YYYY")
//             title
//             description
//           }
//         }
//       }
//     }
//   }
// `;
