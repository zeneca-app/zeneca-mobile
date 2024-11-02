/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        electric: {
          10: "#F6F5FF",
          20: "#EAE5FF",
          30: "#B9B4FE",
          40: "#8A6FF6",
          50: "#5A10EF",
          60: "#3C28A4",
          70: "#21194C",
        },
        dark: {
          content: {
            active: "#F7F7F8",
            disabled: "#D7BFFA2B",
            dark: "#19181B",
            30: "#E9DCFB73",
          },
          bull: "#04AE92",
          short: "#F58989",
          background: {
            100: "#19181B",
            90: "#262429",
            80: "#313036",
            white: "#ffffff",
          },
          highlight: "#18171A",
          gray: {
            alpha: {
              3: "#080708",
              8: "#0F0F10",
              17: "#171618",
              28: "#262429",
              43: "#3F3C44",
              58: "#58545E",
              73: "#716C79",
              82: "#8B8593",
              86: "#A5A1AB",
              91: "#BEBBC3",
            },
          },
        },
        light: {
          content: {
            60: "#6F6C7A",
          },
          success: "#04AE92",
          gray: {
            alpha: {
              3: "#37163708",
              8: "#12123714",
              17: "#140E312B",
              28: "#13092C47",
              43: "#0B04206E",
              58: "#07021A94",
              73: "#070311BA",
              82: "#04030AD1",
              86: "#030006DB",
              91: "#020003E8",
            },
          },
        },
        gray: {
          10: "#F7F7F8",
          20: "#ececef",
          30: "#e4e3e8",
          40: "#BDBAC4",
          50: "#96939F",
          60: "#6F6C7A",
          70: "#4A4751",
          80: "#313036",
          90: "#262429",
          100: "#19181B",
          alpha: {
            90: "#000001C2",
          },
        },
        red: {
          20: "#F58989",
        },
        basic: {
          black: "#0D0C0E",
        },
        semantic: {
          educational: "#091BDC",
          danger: "#EB1313",
          warning: "#FFBF00",
          success: "#04AE92",
        },
      },
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
        "button-m": [
          16,
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
      spacing: {
        layout: 24,
        "bottom-actions": 110,
      },
    },
  },
  plugins: [],
};
