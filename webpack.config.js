const path = require("path");
const Dotenv = require("dotenv-webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    popup: "./popup.js",
    background: "./background.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  devtool: "inline-source-map",
  plugins: [
    new Dotenv(),
    new CopyWebpackPlugin({
      patterns: [
        { from: "manifest.json", to: "manifest.json" },
        { from: "popup.html", to: "popup.html" },
        { from: "popup.css", to: "popup.css" },
        {
          from: "node_modules/pdfjs-dist/build/pdf.worker.mjs",
          to: "pdf.worker.js",
        },
        { from: "icon16.png", to: "icon16.png" },
        { from: "icon48.png", to: "icon48.png" },
        { from: "icon128.png", to: "icon128.png" },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
};
