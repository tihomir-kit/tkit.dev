// import React from "react";
// import Image from "gatsby-image";
// import { useStaticQuery, graphql } from "gatsby";
// import { css } from "@emotion/react";

// import { rhythm } from "@/utils";

// function getBioData() {
//   // See: https://www.gatsbyjs.org/docs/use-static-query/
//   return useStaticQuery(graphql`
//     query BioQuery {
//       avatar: file(absolutePath: { regex: "/profile-pic.jpg/" }) {
//         childImageSharp {
//           fixed(width: 50, height: 50) {
//             ...GatsbyImageSharpFixed
//           }
//         }
//       }
//       site {
//         siteMetadata {
//           author {
//             name
//           }
//           social {
//             twitter
//             github
//           }
//         }
//       }
//     }
//   `);
// }

// const bioStyle = css`
//   display: flex;
//   margin-bottom: ${rhythm(2.5)};
// `;

// const imgStyle = css`
//   margin-right: ${rhythm(1 / 2)};
//   margin-bottom: 0;
//   min-width: 50;
//   border-radius: 50%;
// `;

// const Bio = () => {
//   const data = getBioData();
//   const { author, social } = data.site.siteMetadata;

//   return (
//     <div css={bioStyle}>
//       <Image fixed={data.avatar.childImageSharp.fixed} alt={author.name} css={imgStyle} />
//       <p>
//         Written by <strong>{author.name}</strong>, a senior software engineer{" "}
//         <a href="https://www.dovetail.ie/">@Dovetail</a>. <br />
//         🖖 Stay curious. <a href={`https://github.com/${social.github}`}>@GitHub</a>
//       </p>
//     </div>
//   );
// };

// export default Bio;
