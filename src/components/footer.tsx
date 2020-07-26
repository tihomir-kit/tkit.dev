import React from "react";

import { rhythm, scale } from "@/utils";

// TODO: use a type instead of any
const Footer = ({ location, title, children }: any) => {
  return (
    <footer
      style={{
        ...scale(-1 / 3),
      }}>
      Copyleft © {new Date().getFullYear()}, <a href="https://github.com/pootzko/tkit.dev">all wrongs reserved</a>.
      Built with <a href="https://www.gatsbyjs.org">Gatsby</a> and hosted on{" "}
      <a href="https://www.netlify.com/">Netlify</a>.
    </footer>
  );
};

export default Footer;
