// import React from "react";
// import { Global, css } from "@emotion/react";

// import { rhythm, colors, globalStyle } from "@/utils";
// import Logo from "./logo";
// import Footer from "./footer";

// const appStyle = css`
//   max-width: ${rhythm(34)};
//   display: flex;
//   flex-direction: column;
//   min-height: 100vh;

//   @media (min-width: 768px) {
//     display: grid;
//     grid-template-columns: 220px 1fr;
//     grid-template-rows: auto 1fr auto;
//   }
// `;

// const mainStyle = css`
//   flex: 1;
//   padding: 20px;
// `;

// const navStyle = css`
//   background-color: ${colors.main};
//   padding: 20px;
// `;

// // TODO: use a type instead of any
// const Layout = ({ location, title, children }: any) => {
//   return (
//     <div css={appStyle}>
//       <Global styles={globalStyle} />
//       <nav css={navStyle}>
//         <Logo />
//         Left nav
//       </nav>
//       <main css={mainStyle}>
//         {children}
//         <Footer />
//       </main>
//     </div>
//   );
// };

// export default Layout;
