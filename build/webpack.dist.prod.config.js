const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const webpackBaseConfig = require("./webpack.base.config.js");
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

process.env.NODE_ENV = "production";

module.exports = merge(webpackBaseConfig, {
	devtool: "source-map",
	entry: {
		main: "./src/index.js"
	},
	output: {
		path: path.resolve(__dirname, "../dist"),
		publicPath: "/dist/",
		filename: "vui-design.min.js",
		library: "vui-design",
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
			"process.env.NODE_ENV": '"production"'
		}),
		new UglifyJsPlugin({
			parallel: true,
			sourceMap: true
		}),
		new CompressionPlugin({
			filename: "[path].gz[query]",
			algorithm: "gzip",
			test: /\.(js|css)$/,
			threshold: 10240,
			minRatio: 0.8
		})
	]
});