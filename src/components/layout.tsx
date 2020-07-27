import React from "react";
import { css } from "@emotion/core";
import { rhythm, scale } from "@/utils";

import { colors } from "../utils/colors";
import Logo from "./logo";
import Footer from "./footer";

const appStyle = css`
  max-width: ${rhythm(34)};
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 220px 1fr;
    grid-template-rows: auto 1fr auto;
  }
`;

const mainStyle = css`
  flex: 1;
  padding: 20px;
`;

const navStyle = css`
  background-color: ${colors.main};
  padding: 20px;
`;

// padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,

// TODO: use a type instead of any
const Layout = ({ location, title, children }: any) => {
  console.log(appStyle);
  return (
    <div css={appStyle}>
      <nav css={navStyle}>
        <Logo />
        Left nav
      </nav>
      <main css={mainStyle}>
        {children}
        <Footer />
      </main>
    </div>
  );
};

export default Layout;
