import React from "react";
import { Link, graphql } from "gatsby";
import { css } from "@emotion/react";

import { rhythm } from "@/utils";
import { Layout, SEO, ItemHeading, Bio } from "@/components";

const headingStyle = css`
  margin-bottom: ${rhythm(3 / 5)};
`;

const navStyle = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  padding: 0;
`;

// TODO: use a type instead of any
const BlogPostTemplate = ({ data, pageContext, location }: any) => {
  const post = data.markdownRemark;
  const siteTitle = data.site.siteMetadata.title;
  const { previous, next } = pageContext;

  function commentsLink() {
    if (!post.frontmatter.commentsUrl) {
      return "";
    }

    return <a href={post.frontmatter.commentsUrl}>Comment on GitHub</a>;
  }

  console.log(post.frontmatter.featuredImage);

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={post.frontmatter.title} description={post.frontmatter.description || post.excerpt} />
      <article>
        <div css={headingStyle}>
          <ItemHeading
            heading={post.frontmatter.title}
            subHeading={post.frontmatter.date}
            featuredImage={post.frontmatter.featuredImage}
          />
        </div>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <footer>
          {commentsLink()}
          <hr
            style={{
              marginBottom: rhythm(1),
            }}
          />
          <Bio />
        </footer>
      </article>
      <nav>
        <ul css={navStyle}>
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
