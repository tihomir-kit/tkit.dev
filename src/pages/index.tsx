import React from "react";
import { Link, graphql } from "gatsby";

import { Layout, SEO, Bio } from "@/components";
import { rhythm, colors } from "@/utils";

import "./styles.scss";

// TODO: use a type instead of any
const BlogIndex = ({ data, location }: any) => {
  const siteTitle = data.site.siteMetadata.title;
  const posts = data.allMarkdownRemark.edges;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Tihomir Kit - Dev blog" />
      <Bio />
      {posts.map(({ node }: any) => {
        const title = node.frontmatter.title || node.fields.slug;
        return (
          <article key={node.fields.slug}>
            <header>
              <h3
                style={{
                  marginBottom: rhythm(1 / 4),
                }}>
                <Link style={{ boxShadow: "none" }} to={node.fields.slug}>
                  {title}
                </Link>
              </h3>
              <small style={{ color: colors.light }}>{node.frontmatter.date}</small>
            </header>
            <section>
              <p
                style={{
                  marginBottom: rhythm(1.75),
                }}
                dangerouslySetInnerHTML={{
                  __html: node.frontmatter.description || node.excerpt,
                }}
              />
            </section>
          </article>
        );
      })}
    </Layout>
  );
};

export default BlogIndex;

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`;
