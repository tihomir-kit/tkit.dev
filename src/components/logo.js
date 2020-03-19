/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react";
import { Link } from "gatsby";

import { rhythm, scale, typOptions } from "../utils/typography";

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
          "font-weight": "normal",
        }}>
        TKIT
      </span>
      <span
        style={{
          color: typOptions.colors.accent,
        }}>
        _
      </span>
      <span
        style={{
          transform: "rotate(-90deg)",
          display: "inline-block",
          color: typOptions.colors.light,
          "font-weight": "normal",
          "font-size": "20px",
          "padding-left": "22px",
          "margin-left": "-14px",
        }}>
        dev
      </span>
    </h1>
  );
};

export default Logo;
