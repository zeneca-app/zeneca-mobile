/** @type {import('tailwindcss').Config} */
const COLORS = require("./src/constants/colors");
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: COLORS,
      borderRadius: {
        card: "2.5rem",
        DEFAULT: "2.5rem",
      },
      fontFamily: {
        sans: ['"manrope"'],
      },
      height: {
        "bottom-actions": 110,
        separator: 24,
      },
      width: {
        char: "1em",
      },
      fontSize: {
        base: 16,
        headline: [
          32,
          {
            lineHeight: "1.31",
            letterSpacing: "-0.02em",
            fontWeight: "500",
          },
        ],
        "caption-xl": [
          16,
          {
            lineHeight: "1.46",
            fontWeight: "500",
          },
        ],
        "caption-l": [
          14,
          {
            lineHeight: "1.46",
            fontWeight: "500",
          },
        ],
        "caption-m": [
          12,
          {
            lineHeight: "1.46",
            fontWeight: "500",
          },
        ],
        "caption-s": [
          10,
          {
            lineHeight: "1.46",
            fontWeight: "500",
          },
        ],
        "chart-s": [
          10,
          {
            lineHeight: "1.46",
            fontWeight: "300",
          },
        ],
        "button-s": [
          14,
          {
            lineHeight: "0",
            fontWeight: "700",
          },
        ],
        "button-m": [
          16,
          {
            lineHeight: "0",
            fontWeight: "700",
          },
        ],
        "heading-l": [
          56,
          {
            lineHeight: "1.125",
            letterSpacing: "-0.01em",
            fontWeight: "400",
          },
        ],
        "heading-m": [
          40,
          {
            lineHeight: "1.1",
            letterSpacing: "-0.01em",
            fontWeight: "500",
          },
        ],
        "heading-s": [
          32,
          {
            lineHeight: "1.3125",
            letterSpacing: "-0.01em",
            fontWeight: "500",
          },
        ],
        "body-xl": [
          24,
          {
            lineHeight: 1.5,
            letterSpacing: "0",
            fontWeight: "500",
          },
        ],
        "body-l": [
          20,
          {
            lineHeight: 1.4,
            letterSpacing: "0",
            fontWeight: "500",
          },
        ],
        "body-m": [
          18,
          {
            lineHeight: 1.4,
            letterSpacing: "0",
            fontWeight: "500",
          },
        ],
        "body-s": [
          16,
          {
            lineHeight: 1.5,
            letterSpacing: "0",
            fontWeight: "500",
          },
        ],
      },
      spacing: {
        layout: 24,
        "layout-s": 16,
        "layout-l": 32,
        "bottom-actions": 110,
      },
      gap: {
        xs: 4,
        s: 8,
        DEFAULT: 16,
        l: 24,
        xl: 32,
        xxl: 40,
        buttons: 24,
      },
    },
  },
  plugins: [],
};
