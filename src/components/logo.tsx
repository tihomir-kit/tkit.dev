import React from "react";
import { Link } from "gatsby";
import { css } from "@emotion/core";

import { scale, colors } from "@/utils";

const logoStyle = [
  css({ ...scale(1.5) }),
  css`
    margin-top: 0;
  `,
];

const linkStyle = css`
  box-shadow: none;
  text-decoration: none;
  color: inherit;
`;

const tkitStyle = css`
  font-weight: normal;
`;

const lodashStyle = css`
  color: ${colors.accent};
  padding-left: 4px;
`;

const devStyle = css`
  color: ${colors.light};
  transform: rotate(-90deg);
  display: inline-block;
  font-weight: normal;
  font-size: 18px;
  padding-left: 20px;
  margin-left: -14px;
`;

const Logo = () => {
  return (
    <h1 css={logoStyle}>
      <Link css={linkStyle} to={"/"}>
        <span css={tkitStyle}>TKIT</span>
        <span css={lodashStyle}>_</span>
        <span css={devStyle}>dev</span>
      </Link>
    </h1>
  );
};

export default Logo;
