// SEE: https://kyleamathews.github.io/typography.js/

// SAMPLES:
// https://github.com/KyleAMathews/typography.js/blob/master/packages/typography-theme-st-annes/src/index.js
// https://github.com/KyleAMathews/typography.js/blob/master/packages/typography-theme-wordpress-2016/src/index.js

import Typography, { TypographyOptions } from "typography";

import { colors } from "./colors";

const typography = new Typography({
  headerFontFamily: ["Montserrat"],
  headerWeight: 500,
  bodyFontFamily: ["Lato"],
  baseFontSize: "18px",
  baseLineHeight: 1.75,
  googleFonts: [
    {
      name: "Montserrat",
      styles: ["300", "400", "500"], // TODO: remove unnecessary extras
    },
    {
      name: "Lato",
      styles: ["400", "400i", "700", "700i"],
    },
  ],
  overrideStyles: ({ adjustFontSizeTo, scale, rhythm }, options) => ({
    body: {
      color: colors.body,
    },
    "a, a:hover, a:active": {
      textDecoration: "none",
      color: colors.body,
    },
    "section a, footer a": {
      color: colors.accent,
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
