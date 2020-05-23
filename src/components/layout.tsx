import React from "react";

import { rhythm, scale } from "@/utils";
import Logo from "./logo";

// TODO: use a type instead of any
const Layout = ({ location, title, children }: any) => {
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
      <footer
        style={{
          ...scale(-1 / 3),
        }}>
        Copyleft © {new Date().getFullYear()}, <a href="https://github.com/pootzko/tkit.dev">all wrongs reserved</a>.
        Built with <a href="https://www.gatsbyjs.org">Gatsby</a> and hosted on{" "}
        <a href="https://www.netlify.com/">Netlify</a>.
      </footer>
    </div>
  );
};

export default Layout;
