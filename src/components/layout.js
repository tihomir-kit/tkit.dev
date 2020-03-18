import React from "react";
import { Link } from "gatsby";

import { rhythm, scale } from "../utils/typography";

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`;
  let header;

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
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
            color: "#070619",
            "font-weight": "normal",
          }}>
          TKIT
        </span>
        <span
          style={{
            color: "#D01A44",
          }}>
          _
        </span>
        <span
          style={{
            transform: "rotate(-90deg)",
            display: "inline-block",
            color: "#bcb5c5",
            "font-weight": "normal",
            "font-size": "20px",
            "padding-left": "22px",
            "margin-left": "-14px",
          }}>
          dev
        </span>
      </h1>
    );
  } else {
    header = (
      <h3
        style={{
          fontFamily: "Montserrat, sans-serif",
          marginTop: 0,
        }}>
        <Link
          style={{
            boxShadow: "none",
            textDecoration: "none",
            color: "inherit",
          }}
          to={"/"}>
          {title}
        </Link>
      </h3>
    );
  }

  return (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: rhythm(26),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}>
      <header>{header}</header>
      <main>{children}</main>
      <footer>
        Copyleft © {new Date().getFullYear()}, all wrongs reserved. Built with{" "}
        <a href="https://www.gatsbyjs.org">Gatsby</a> and hosted on <a href="https://www.netlify.com/">Netlify</a>.
      </footer>
    </div>
  );
};

export default Layout;
