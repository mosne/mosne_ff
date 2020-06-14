#  Mosne FrontEnd Framework
##  What is Mosne FrontEnd Framework ?

MOSNE FrontEnd Framework (FF) is a Front-end WordPress theme friendly boilerplate to help you to build your own WordPress theme with modern tools and a better productivity.

## Tools
* [Webpack 4](https://www.npmjs.com/package/webpack)
* [Node SASS](https://www.npmjs.com/package/node-sass)
* [SVGStore](https://www.npmjs.com/package/svgstore)
* [SVGGo](https://www.npmjs.com/package/svgstore)
* [Lazysizes](https://www.npmjs.com/package/lazysizes)
* [Eslint](https://www.npmjs.com/package/eslint)
* [Babel Loader](https://www.npmjs.com/package/babel-loader)
* [Browser Sync](https://www.npmjs.com/package/browser-sync-webpack-plugin)

## Requirements
### Composer
You need composer to autoload all your classes from the inc folder.

Use the `beapi/composer-scaffold-theme` package that add it automatically to the composer.json file.
You can add it yourself like this :

```composer.json
    "autoload": {
        "psr-4": {
            "BEA\\Theme\\Framework\\": "content/themes/framework/inc/"
        }
    }
```

## Autoload
The autoload is based on psr-4 and handled by composer.

### Node 10

You need a minimum of Node 10.

## Installation

```bash
$ git clone git@github.com:mosne/mosne_ff.git your_theme_name
```
Next, go to your theme folder.

```bash
$ cd wp-content/themes/your_theme_name
```

Then install node dependencies with NPM or Yarn.
```bash
$ yarn install
```

## Configuration
### Webpack
You can edit Webpack configuration with `webpack.config.js` file and settings by editing `webpack.settings.js`.
For live editing edit the website url and the server path to the dist folder.
```javascript
  liveServer: 'https://2020.mosne.it',
  liveServerRoute: '/wp-content/themes/mosne_2020/dist',
```

### Babel
You can find a `.babelrc` file to modify Babel configuration.

### Eslint
You can find a `.eslintrc.js` file to modify Eslint configuration and ignore files in `.eslintignore`.

## How to use Mosne FF ?
After installing dependencies, you can run some commands which are explained below.

### Live Server with Browser Sync

and run a first time the following command to generate required distributions files to run the server properly.
```
$ yarn run build
```

Then, you can luch Browser Sync proxy by running :
```bash
$ yarn live
```

### Watching files for development purpose
If you don't need a local server you just can compile AND watch styles and scripts (with sourcemap) by using :

```bash
$ yarn run watch
```

### Development build
If you want to build styles and scripts (with sourcemap) by using :

```bash
$ yarn run build:dev
```

### Production build
For production purpose, you can compile all of your assets by using :

```bash
$ yarn run build:prod
```

If you want to deliver just css and assets run :

```bash
$ yarn run fast
```

### Assets
#### SVG Icons
Generate SVG sprite from the icons files in src/img/icons/ by using :

```bash
$ yarn run icons
```