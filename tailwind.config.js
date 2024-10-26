/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: {
          content: {
            active: "#F7F7F8",
            disabled: "#D7BFFA2B",
            dark: "#19181B",
            30: "#E9DCFB73",
          },
          bull: "#04AE92",
          short: "#F58989",
          background: "#19181B",
          highlight: "#18171A",
        },
        light: {
          content: {
            60: "#6F6C7A",
          },
          success: "#04AE92",
        },
        gray: {
          10: "#F7F7F8",
          50: "#96939F",
          80: "#626666", //Grayscale/Gray-3
        },
        red: {
          20: "#F58989",
        },
      },
      rounded: {
        DEFAULT: "2.5rem",
      },
      fontFamily: {
        sans: ['"manrope"'],
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
          "1rem",
          {
            lineHeight: "1.46",
            fontWeight: "500",
          },
        ],
        "button-s": [
          "1rem",
          {
            lineHeight: "1.15",
            fontWeight: "600",
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
      },

      spacing: {},
    },
  },
  plugins: [],
};
