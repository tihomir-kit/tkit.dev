import React from "react";

import { rhythm, scale } from "@/utils";
import Logo from "./logo";
import Footer from "./footer";

// TODO: use a type instead of any
const Layout = ({ location, title, children }: any) => {
  return (
    <div
      className="app"
      style={{
        maxWidth: rhythm(36),
        // padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
      }}>
      <nav>
        <Logo />
        Left nav
      </nav>
      <main>
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
