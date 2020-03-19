import React from "react";
import { Link, graphql } from "gatsby";
import Img from "gatsby-image";

import Bio from "../components/bio";
import Layout from "../components/layout";
import SEO from "../components/seo";

import { rhythm, scale } from "../utils/typography";
import colors from "../utils/colors";

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const { previous, next } = pageContext;

  function commentsLink() {
    if (!post.frontmatter.commentsUrl) {
      return "";
    }

    return <a href={post.frontmatter.commentsUrl}>Comment on GitHub</a>;
  }

  function featuredImage() {
    // TODO: Extract to component
    if (!post.frontmatter.featuredImage) {
      return "";
    }

    return <Img fluid={post.frontmatter.featuredImage.childImageSharp.fluid} />;
  }

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={post.frontmatter.title} description={post.frontmatter.description || post.excerpt} />
      <article>
        <header>
          <div>{featuredImage()}</div>
          <h2
            style={{
              marginTop: rhythm(1),
              marginBottom: 0,
            }}>
            {post.frontmatter.title}
          </h2>
          <p
            style={{
              ...scale(-1 / 5),
              display: "block",
              marginBottom: rhythm(1.5),
            }}>
            <small style={{ color: colors.light }}>{post.frontmatter.date}</small>
          </p>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <div className="post-footer">{commentsLink()}</div>
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <footer>
          <Bio />
        </footer>
      </article>
      <nav>
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            listStyle: "none",
            padding: 0,
          }}>
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  );
};

export default BlogPostTemplate;

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        commentsUrl
        featuredImage {
          childImageSharp {
            fluid(maxWidth: 780) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`;
