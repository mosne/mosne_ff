const portfinder = require('portfinder')

// BrowserSync options
const browserSyncOptions = {
  port: 3000,
  proxy: `https://projectname.monse.it/`,
  https: true,
  injectChanges: true,
  files: ['*.php', '**/*.php', 'dist/*.css', 'dist/*.js', 'dist/img/icons/*.svg'],
  startPath: '/',
  notify: true,
}

// Plugin options
const pluginOptions = {
  injectCss: true,
}

portfinder.getPort(
  {
    port: 3000, // default port
    stopPort: 3333, // maximum port
  },
  function (port) {
    browserSyncOptions.port = port
  }
)

module.exports = {
  browserSyncOptions,
  pluginOptions,
}
