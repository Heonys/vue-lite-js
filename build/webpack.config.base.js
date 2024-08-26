const { resolve } = require("./utils");

module.exports = {
  resolve: {
    alias: {
      "@": resolve("src"),
      "@core": resolve("src/core"),
      "@binder": resolve("src/core/binder"),
      "@vm": resolve("src/core/viewmodel"),
      "@reactive": resolve("src/core/reactive"),
      "@utils": resolve("src/utils"),
    },
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          transpileOnly: true, //HMR doesn't work without this
        },
      },
    ],
  },
  plugins: {},
};
