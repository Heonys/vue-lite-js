const webpack = require("webpack");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const baseConfig = require("./webpack.config.base");
const { resolve } = require("./utils");

module.exports = merge(baseConfig, {
  mode: "development",
  entry: {
    sample: resolve("dev/index.ts"),
  },
  devtool: "source-map",
  devServer: {
    port: 9000,
    hot: true,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "dev/index.html",
      inject: true,
    }),
  ],
});
