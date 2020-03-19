import React from "react";

import { rhythm } from "../utils/typography";
import Logo from "./logo";

const Layout = ({ location, title, children }) => {
  return (
    <div
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        maxWidth: rhythm(26),
        padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}>
      <header>
        <Logo />
      </header>
      <main>{children}</main>
      <footer>
        Copyleft © {new Date().getFullYear()}, all wrongs reserved. Built with{" "}
        <a href="https://www.gatsbyjs.org">Gatsby</a> and hosted on <a href="https://www.netlify.com/">Netlify</a>.
      </footer>
    </div>
  );
};

export default Layout;
