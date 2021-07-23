import React from "react";
import { Link } from "gatsby";
import Img from "gatsby-image";
import { css } from "@emotion/react";

import { rhythm, scale, colors } from "@/utils";

const headingStyle = css`
  ${css({ ...scale(0.75) })}
  margin-top: ${rhythm(1)};
  margin-bottom: 0;
`;

const linkStyle = css`
  box-shadow: none;
`;

const subHeadingStyle = [
  css({ ...scale(-2 / 5) }),
  css`
    display: block;
    margin-top: ${rhythm(0.2)};
    margin-bottom: ${rhythm(0.2)};
    letter-spacing: ${rhythm(0.0625)};
    text-transform: uppercase;
    color: ${colors.light};
  `,
];

// TODO: use a type instead of any
const ItemHeading = ({ heading, subHeading, to, featuredImage }: any) => {
  return (
    <header>
      {featuredImage && <Img fluid={featuredImage.childImageSharp.fluid} />}

      <h2 css={headingStyle}>
        {to ? (
          <Link css={linkStyle} to={to}>
            {heading}
          </Link>
        ) : (
          heading
        )}
      </h2>

      {subHeading && <small css={subHeadingStyle}>{subHeading}</small>}
    </header>
  );
};

export default ItemHeading;
