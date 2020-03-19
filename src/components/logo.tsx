/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import { Link } from "gatsby";

import { scale } from "../utils/typography";
import colors from "../utils/colors";

// const Logo: React.FC = ({ post: any }) => {
const Logo = () => {
  return (
    <h1
      style={{
        ...scale(1.5),
        marginTop: 0,
      }}>
      <Link
        style={{
          boxShadow: "none",
          textDecoration: "none",
          color: "inherit",
        }}
        to={"/"}></Link>
      <span
        style={{
          fontWeight: "normal",
        }}>
        TKIT
      </span>
      <span
        style={{
          color: colors.accent,
        }}>
        _
      </span>
      <span
        style={{
          color: colors.light,
          transform: "rotate(-90deg)",
          display: "inline-block",
          fontWeight: "normal",
          fontSize: "20px",
          paddingLeft: "22px",
          marginLeft: "-14px",
        }}>
        dev
      </span>
    </h1>
  );
};

export default Logo;
