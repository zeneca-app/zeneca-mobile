// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    "expo",
    "airbnb",
    "airbnb/hooks",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "react", "prettier"],
  parser: "@typescript-eslint/parser",
  rules: {
    "prettier/prettier": 1,
  },
};
