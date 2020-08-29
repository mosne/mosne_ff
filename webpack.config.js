const fs = require('fs')
const config = require('./webpack.settings')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackBar = require('webpackbar')
const StylelintPlugin = require('stylelint-webpack-plugin')
const getServerPort = function (portFile) {
	try {
		require('fs').accessSync(portFile, fs.R_OK | fs.W_OK)

		return parseInt(fs.readFileSync(portFile, 'utf8'))
	} catch (e) {
		return false
	}
}
const webpackConfig = {
	entry: config.entry,
	output: {
		path: config.assetsPath,
	},
	optimization: {},
	externals: {
		jquery: 'jQuery',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							babelrc: true,
						},
					},
					{
						loader: 'eslint-loader',
					},
				],
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'style-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							plugins: () => [require('autoprefixer')()],
						},
					},
					'resolve-url-loader',
				],
			},
			{
				test: /\.(sass|scss)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							url: false,
							sourceMap: true,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							plugins: () => [require('autoprefixer')()],
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
			},
			{
				test: /\.(woff2?|woff|eot|ttf|otf|mp3|wav)(\?.*)?$/,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: './fonts/',
					},
				},
			},
			{
				test: /\.(png|jpe?g|gif|svg)$/,
				use: [
					'file-loader',
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
								quality: 65,
							},
							pngquant: {
								quality: '65-90',
								speed: 4,
							},
							gifsicle: {
								interlaced: false,
							},
							webp: {
								quality: 75,
							},
						},
					},
				],
			},
		],
	},
	plugins: [new WebpackBar(), new StylelintPlugin()],
}

module.exports = (env, argv) => {
	if (argv.mode === 'development') {
		const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
		const SoundsPlugin = require('sounds-webpack-plugin')
		webpackConfig.devtool = 'cheap-module-source-map'
		webpackConfig.output.filename = '[name].js'
		webpackConfig.plugins.push(
			new SoundsPlugin(),
			new MiniCssExtractPlugin({
				filename: '[name].css',
				allChunks: true,
			}),
			new BrowserSyncPlugin(
				{
					port: getServerPort('./.bs-port') || 3000,
					proxy: 'http://[::1]:' + (getServerPort('./.port') || 9090),
					files: [
						{
							match: config.refresh,
							fn: function (event, file) {
								const bs = require('browser-sync').get('bs-webpack-plugin')

								if (
									event === 'change' &&
									file !== 'dist/WebpackBuiltFiles.php' &&
									file.indexOf('.css') === -1
								) {
									bs.reload()
								}

								if (event === 'change' && file.indexOf('.css') !== -1) {
									bs.stream()
								}
							},
						},
					],
					startPath: '/dev/index.php',
					notify: true,
				},
				{
					reload: false,
					injectCss: true,
				}
			)
		)
	}
	if (argv.mode === 'none') {
		const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
		const SoundsPlugin = require('sounds-webpack-plugin')
		webpackConfig.devtool = 'cheap-module-source-map'
		webpackConfig.output.filename = '[name].js'
		webpackConfig.plugins.push(
			new SoundsPlugin(),
			new MiniCssExtractPlugin({
				filename: '[name].css',
				allChunks: true,
			}),
			new BrowserSyncPlugin(
				{
					port: getServerPort('./.bs-port') || 3000,
					proxy: config.liveServer,
					https: config.liveHttps,
					serveStatic: [
						{
							route: config.liveServerRoute,
							dir: './dist',
						},
					],
					files: [
						{
							match: config.liverefresh,
							fn: function (event, file) {
								const bs = require('browser-sync').get('bs-webpack-plugin')
								if (event === 'change' && file.indexOf('.css') === -1) {
									bs.reload()
								}
								if (event === 'change' && file.indexOf('.js') !== -1) {
									bs.stream()
								}
							},
						},
					],
					startPath: config.liveStartDir,
					notify: true,
				},
				{
					reload: false,
					injectCss: true,
				}
			)
		)
	}
	if (argv.mode === 'production') {
		webpackConfig.devtool = 'cheap-module-source-map'
		webpackConfig.optimization.minimizer = [
			new OptimizeCssAssetsPlugin({
				cssProcessor: require('cssnano'),
				cssProcessorPluginOptions: {
					preset: [
						'default',
						{
							sourcemap: true,
							discardComments: { sourcemap: true, removeAll: true },
						},
					],
				},
			}),
			new UglifyJsPlugin({
				sourceMap: true,
			}),
		]
		webpackConfig.output.filename = '[name].js'
		webpackConfig.plugins.push(
			new MiniCssExtractPlugin({
				filename: '[name].css',
				allChunks: true,
			})
		)
	}
	return webpackConfig
}
