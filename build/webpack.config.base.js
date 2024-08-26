const { resolve } = require("./utils");

module.exports = {
  resolve: {
    alias: {
      "@": resolve("src"),
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
