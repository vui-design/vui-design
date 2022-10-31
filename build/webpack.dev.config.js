const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base.config.js");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");

module.exports = merge(webpackBaseConfig, {
	devtool: "eval-source-map",
	entry: {
		main: "./examples/main",
		vendors: ["vue", "vue-router"]
	},
	output: {
		path: path.join(__dirname, "../examples/dist"),
		publicPath: "",
		filename: "[name].js",
		chunkFilename: "[name].chunk.js"
	},
	resolve: {
		alias: {
			"vue": "vue/dist/vue.esm.js",
			"vui-design": "../../src/index"
		}
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "vendors",
			filename: "vendor.bundle.js"
		}),
		new HtmlWebpackPlugin({
			inject: true,
			filename: path.join(__dirname, "../examples/dist/index.html"),
			template: path.join(__dirname, "../examples/index.html")
		}),
		new FriendlyErrorsPlugin()
	]
});