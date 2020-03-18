// SEE: https://kyleamathews.github.io/typography.js/

import Typography from "typography";

const typography = new Typography({
  headerFontFamily: ["Montserrat"],
  headerWeight: 500,
  bodyFontFamily: ["Lato"],
  baseFontSize: "18px",
  baseLineHeight: 1.75,
  googleFonts: [
    {
      name: "Montserrat",
      styles: ["300", "400", "500"],
    },
    {
      name: "Lato",
      styles: ["400", "400i", "700", "700i"],
    },
  ],
  overrideStyles: ({ adjustFontSizeTo, scale, rhythm }, options) => ({
    a: {
      color: "#e61747",
      textDecoration: "none",
      // fontWeight: "bold",
    },
  }),
});

// Hot reload typography in development.
if (process.env.NODE_ENV !== "production") {
  typography.injectStyles();
}

export default typography;
export const { scale, rhythm, options } = typography;
