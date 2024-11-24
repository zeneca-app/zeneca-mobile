/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
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
        "manrope-Light": ['"Manrope_300Light"', '"manrope"'],
        "manrope-Regular": ['"Manrope_400Regular"', '"manrope"'],
        "manrope-Medium": ['"Manrope_500Medium"', '"manrope"'],
        "manrope-SemiBold": ['"Manrope_600SemiBold"', '"manrope"'],
        "manrope-Bold": ['"Manrope_700Bold"', '"manrope"'],
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
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        ".text-button-m": {
          fontFamily: '"Manrope_700Bold"',
          fontSize: 16,
          letterSpacing: "-0.02em",
          lineHeight: "1.5",
        },
        ".text-button-s": {
          fontFamily: '"Manrope_700Bold"',
          fontSize: 14,
          letterSpacing: "-0.02em",
          lineHeight: "1.5",
        },
        ".text-caption-xl": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 16,
          lineHeight: "1.46",
        },
        ".text-caption-l": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 14,
          lineHeight: "1.46",
        },
        ".text-caption-m": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 12,
          lineHeight: "1.46",
        },
        ".text-caption-s": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 10,
          lineHeight: "1.46",
        },
        ".text-caption-xl-bold": {
          fontFamily: '"Manrope_700Bold"',
          fontSize: 16,
          lineHeight: "1.46",
        },
        ".text-caption-l-bold": {
          fontFamily: '"Manrope_700Bold"',
          fontSize: 14,
          lineHeight: "1.46",
        },
        ".text-caption-m-bold": {
          fontFamily: '"Manrope_700Bold"',
          fontSize: 12,
          lineHeight: "1.46",
        },
        ".text-caption-s-bold": {
          fontFamily: '"Manrope_700Bold"',
          fontSize: 10,
          lineHeight: "1.46",
        },
        ".text-chart-s": {
          fontFamily: '"Manrope_300Light"',
          fontSize: 10,
          lineHeight: "1.46",
        },
        ".text-heading-l": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 56,
          lineHeight: "1.125",
        },
        ".text-heading-m": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 40,
          lineHeight: "1.125",
        },
        ".text-heading-s": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 32,
          lineHeight: "1.125",
        },
        ".text-body-xl": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 24,
          lineHeight: "1.5",
        },
        ".text-body-l": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 20,
          lineHeight: "1.4",
        },
        ".text-body-m": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 18,
          lineHeight: "1.4",
        },
        ".text-body-s": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 16,
          lineHeight: "1.5",
        },
      });
    }),
  ],
};
