const path = require('path')

module.exports = {
	entry: {
		app: ['./src/js/app.js', './src/scss/style.scss'],
		'editor-style': './src/scss/editor-style.scss',
		login: './src/scss/login.scss',
	},
	assetsPath: path.resolve(__dirname, 'dist'),
	dev: process.env.NODE_ENV === 'dev',
	refresh: ['*.php', 'dist/app.css', 'dist/app.js'],
	liveHttps: true,
	liveServer: 'https://2020.mosne.it', // your website url
	liveStartDir: '/',
	liveServerRoute: '/wp-content/themes/mosne_2020/dist', // your path to dist
	liverefresh: ['dist/app.css', 'dist/app.js'], // your pattern to css relative to dist
}
