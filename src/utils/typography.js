// SEE: https://kyleamathews.github.io/typography.js/
// SAMPLES:
// https://github.com/KyleAMathews/typography.js/blob/master/packages/typography-theme-st-annes/src/index.js
// https://github.com/KyleAMathews/typography.js/blob/master/packages/typography-theme-wordpress-2016/src/index.js

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
  colors: {
    body: "#070619",
    light: "#bcb5c5",
    main: "#2f2c54",
    accent: "#e61747",
    extra1: "#5f0f36",
    extra2: "#9a113b",
    extra3: "#d01a44",
  },
  overrideStyles: ({ adjustFontSizeTo, scale, rhythm }, options) => ({
    body: {
      color: options.colors.body,
    },
    "a, a:hover, a:active": {
      textDecoration: "none",
      color: options.colors.body,
    },
    "section a, footer a": {
      color: options.colors.accent,
      // fontWeight: "bold",
    },
  }),
});

// Hot reload typography in development.
if (process.env.NODE_ENV !== "production") {
  typography.injectStyles();
}

export default typography;
export const { scale, rhythm } = typography;
export const typOptions = typography.options;
