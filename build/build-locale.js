const path = require("path");
const webpack = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const readDir = require("fs").readdirSync;
const files = readDir("./src/locale/lang");
const entry = {};

process.env.NODE_ENV = "production";

files.forEach(file => {
  const name = file.split(".")[0];

  entry[name] = "./src/locale/lang/" + file;
});

module.exports = {
  devtool: "source-map",
  entry,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        options: {
          sourceMap: true
        },
        exclude: /node_modules/
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "../dist/locale"),
    publicPath: "/dist/locale/",
    filename: "[name].js",
    library: "vui-design/locale",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  externals: {
    vue: {
      root: "Vue",
      commonjs: "vue",
      commonjs2: "vue",
      amd: "vue"
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": "'production'"
    }),
    new UglifyJsPlugin({
      parallel: true,
      sourceMap: true
    })
  ]
};