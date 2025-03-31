/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");
const COLORS = require("./src/constants/colors");
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  fontFamily: {
    sans: ['"manrope"'],
    Manrope_700Bold: ['"Manrope_700Bold"'],
    Manrope_600SemiBold: ['"Manrope_600SemiBold"'],
    Manrope_500Medium: ['"Manrope_500Medium"'],
    Manrope_400Light: ['"Manrope_400Regular"'],
    Manrope_300Light: ['"Manrope_300Light"'],
  },
  theme: {
    extend: {
      colors: COLORS,
      borderRadius: {
        card: "2.5rem",
        DEFAULT: "2.5rem",
      },
      height: {
        "bottom-actions": 110,
        separator: 24,
      },
      width: {
        char: "1em",
      },
      spacing: {
        layout: 24,
        "layout-s": 16,
        "layout-l": 32,
        "bottom-actions": 110,
        safe: "max(env(safe-area-inset-top, 12px), 12px)",
        "safe-bottom": "max(env(safe-area-inset-bottom, 16px), 16px)",
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
        ".button-m": {
          fontFamily: '"Manrope_700Bold"',
          fontSize: 16,
          letterSpacing: "-0.02em",
          lineHeight: "1.5",
        },
        ".button-s": {
          fontFamily: '"Manrope_700Bold"',
          fontSize: 14,
          letterSpacing: "-0.02em",
          lineHeight: "1.5",
        },
        ".caption-xl": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 16,
          lineHeight: "1.46",
        },
        ".caption-xl-light": {
          fontFamily: '"Manrope_300Light"',
          fontSize: 16,
          lineHeight: "1.46",
        },
        ".caption-l": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 14,
          lineHeight: "1.46",
        },
        ".caption-m": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 12,
          lineHeight: "1.46",
        },
        ".caption-s": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 10,
          lineHeight: "1.46",
        },
        ".caption-xl-bold": {
          fontFamily: '"Manrope_700Bold"',
          fontSize: 16,
          lineHeight: "1.46",
        },
        ".caption-l-bold": {
          fontFamily: '"Manrope_700Bold"',
          fontSize: 14,
          lineHeight: "1.46",
        },
        ".caption-m-bold": {
          fontFamily: '"Manrope_700Bold"',
          fontSize: 12,
          lineHeight: "1.46",
        },
        ".caption-s-bold": {
          fontFamily: '"Manrope_700Bold"',
          fontSize: 10,
          lineHeight: "1.46",
        },
        ".chart-s": {
          fontFamily: '"Manrope_300Light"',
          fontSize: 10,
          lineHeight: "1.46",
        },
        ".heading-l": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 56,
          lineHeight: "1.125",
        },
        ".heading-m": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 40,
          lineHeight: "1.125",
        },
        ".heading-s": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 32,
          lineHeight: "1.125",
        },
        ".body-xl": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 24,
          lineHeight: "1.5",
        },
        ".body-l": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 20,
          lineHeight: "1.4",
        },
        ".body-m": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 18,
          lineHeight: "1.4",
        },
        ".body-s": {
          fontFamily: '"Manrope_500Medium"',
          fontSize: 16,
          lineHeight: "1.5",
        },
      });
    }),
  ],
};
