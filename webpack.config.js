const path = require('path');
const webpack = require('webpack');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
	mode: devMode ? 'development' : 'production',
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/',
		filename: '[name].js',
		globalObject: 'this'
	},
	entry: {
		game: ['./src/main.ts']
	},
	module: {
		noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
		rules: [{
				test: /\.tsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {
						ts: 'babel-loader!ts-loader',
						// Since sass-loader (weirdly) has SCSS as its default parse mode, we map
						// the "scss" and "sass" values for the lang attribute to the right configs here.
						// other preprocessors should work out of the box, no loader config like this necessary.
						'scss': 'vue-style-loader!css-loader!sass-loader',
						'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
					}
				}
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.map.js$/,
				use: ["source-map-loader"],
				enforce: "pre"
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2)$/,
				loader: 'file-loader?name=assets/fonts/[name].[ext]'
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				BASE_URL: '"/"'
			}
		}),
		new HtmlWebPackPlugin({
			template: path.resolve(__dirname, './public', 'index.html'),
			filename: './index.html',
			chunks: ['game', 'vendor']
		}),
		new CopyWebpackPlugin(
			[{
				from: path.resolve(__dirname, './public'),
				to: path.resolve(__dirname, './dist'),
				toType: 'dir',
				ignore: [
					'index.html',
					'.DS_Store'
				]
			}]
		),
	],
	resolve: {
		extensions: [
			'.js',
			'.jsx',
			'.vue',
			'.json',
			'.ts',
			'.tsx'
		],
		alias: {
			vue$: 'vue/dist/vue.runtime.esm.js'
		}
	},
	devServer: {
		// historyApiFallback: true,
		// noInfo: true
	},
	performance: {
		hints: false
	},

	// optimization: {
	// 	splitChunks: {
	// 		cacheGroups: {
	// 			commons: {
	// 				test: /[\\/]node_modules[\\/]/,
	// 				name: 'vendor',
	// 				chunks: 'initial'
	// 			}
	// 		}
	// 	}
	// },
	watchOptions: {
		ignored: [
			'node_modules',
			'assets/**/*'
		]
	}
};
