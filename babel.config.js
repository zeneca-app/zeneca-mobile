module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { 
        jsxImportSource: "nativewind",
        lazyImports: true
      }],
      "nativewind/babel"
    ],
    plugins: [
      ["@babel/plugin-transform-runtime", { 
        regenerator: false 
      }],
      "react-native-reanimated/plugin"
    ]
  };
};
