import * as React from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import PostCardMinimal from '@/components/post-card-minimal/post-card-minimal';
import Pagination from '@/components/pagination/pagination';
import BlogPostsWrapper, { SecTitle } from './style';

type PostsProps = {};

const Posts: React.FunctionComponent<PostsProps> = () => {
  const Data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
      allSitePage(filter: { path: { eq: "/page/1" } }) {
        nodes {
          context {
            numPages
            currentPage
          }
        }
      }
      allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 5) {
        totalCount
        edges {
          node {
            excerpt(pruneLength: 300)
            fields {
              slug
            }
            frontmatter {
              date(formatString: "DD [<span>] MMM YY' [</span>]")
              title
              description
              tags
              featuredImage {
                childImageSharp {
                  fluid(maxWidth: 325, maxHeight: 325, quality: 90) {
                    ...GatsbyImageSharpFluid_withWebp_tracedSVG
                  }
                }
              }
            }
          }
        }
      }
    }
  `);

  const Posts = Data.allMarkdownRemark.edges;
  const TotalPage = Data.allSitePage.nodes[0].context.numPages;
  const CurrentPage = Data.allSitePage.nodes[0].context.currentPage;

  return (
    <BlogPostsWrapper>
      <SecTitle>Leatest Posts</SecTitle>
      {Posts.map(({ node }: any) => {
        const title = node.frontmatter.title || node.fields.slug;
        return (
          <PostCardMinimal
            key={node.fields.slug}
            title={title}
            image={
              node.frontmatter.featuredImage == null
                ? null
                : node.frontmatter.featuredImage.childImageSharp.fluid
            }
            url={node.fields.slug}
            description={node.frontmatter.description || node.excerpt}
            date={node.frontmatter.date}
            tags={node.frontmatter.tags}
          />
        );
      })}

      {TotalPage >> 1 ? (
        <Pagination nextLink="/page/2" currentPage={CurrentPage} totalPage={TotalPage} />
      ) : (
        ''
      )}
    </BlogPostsWrapper>
  );
};

export default Posts;
