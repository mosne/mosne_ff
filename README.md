# Mosne Front-end Framework starter theme for WordPress

![Node.js CI](https://github.com/mosne/mosne_ff/workflows/Node.js%20CI/badge.svg?branch=master) ![PHP Composer](https://github.com/mosne/mosne_ff/workflows/PHP%20Composer/badge.svg) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/3d820cf47a9543a2824bfe98e68bdc66)](https://app.codacy.com/gh/mosne/mosne_ff?utm_source=github.com&utm_medium=referral&utm_content=mosne/mosne_ff&utm_campaign=Badge_Grade_Settings)

## What is Mosne FF

MOSNE FrontEnd Framework (FF) is a Front-end WordPress theme friendly boilerplate to help you to build your own WordPress theme with modern tools and a better productivity.

![MOSNE FF](screenshot.png)

## Based on Be API FrontEnd Framewok

-   [Be API FrontEnd Framewok](https://github.com/BeAPI/beapi-frontend-framework)

## Tools

-   [Webpack 4](https://www.npmjs.com/package/webpack)
-   [Node SASS](https://www.npmjs.com/package/node-sass)
-   [SVGStore](https://www.npmjs.com/package/svgstore)
-   [SVGGo](https://www.npmjs.com/package/svgstore)
-   [svg4all](https://www.marketplacerating.com/etsy/svg4all)
-   [Lazysizes](https://www.npmjs.com/package/lazysizes)
-   [Eslint](https://www.npmjs.com/package/eslint)
-   [Stylelint](https://stylelint.io/)
-   [Babel Loader](https://www.npmjs.com/package/babel-loader)
-   [Browser Sync](https://www.npmjs.com/package/browser-sync-webpack-plugin)
-   [polyfill.io](https://polyfill.io)
-   [Accessible-Mega-Menu](https://github.com/adobe-accessibility/Accessible-Mega-Menu)

## Requirements

### Node 10

You need a minimum of Node 10.

## Installation

```bash
cd wp-content/themes/
```

```bash
git clone git@github.com:mosne/mosne_ff.git your_theme_name
```

Next, go to your theme folder.

```bash
cd your_theme_name
```

Then install node dependencies with Pnpm or Yarn on Npm.

```bash
pnpm install
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

## How to use Mosne FF

After installing dependencies, you can run some commands which are explained below.

### Live Server with Browser Sync

and run a first time the following command to generate required distributions files to run the server properly.

```bash
pnpm run build
```

Then, you can luch Browser Sync proxy by running :

```bash
pnpm live
```

### Watching files for development purpose

If you don't need a local server you just can compile AND watch styles and scripts (with sourcemap) by using :

```bash
pnpm run watch
```

### Development build

If you want to build styles and scripts (with sourcemap) by using :

```bash
pnpm run build:dev
```

### Production build

For production purpose, you can compile all of your assets by using :

```bash
yarn run build:prod
```

If you want to deliver just css and assets run :

```bash
pnpm run fast
```

### Batch autofix assets

Try to auto fix JS using eslint :

```bash
pnpm run fix
```

Try to auto fix SCSS using stylelint :

```bash
pnpm run fixcss
```

Try to auto fix PHP using phpcbf :

```bash
pnpm run fixphp
```

### Assets

#### SVG Icons

Generate SVG sprite from the icons files in src/img/icons/ by using :

```bash
pnpm run icons
```

### Coding standads

Read our wiki page to correctly configure your enviroment

-   [setup Eslint](https://github.com/mosne/mosne_ff/wiki/Eslint-setup-for-js)
-   [setup Stylelint](https://github.com/mosne/mosne_ff/wiki/Stylelint-Setup-for-Scss)
-   [setup Phpcs and Phpcbf](https://github.com/mosne/mosne_ff/wiki/Phpcs-and-Phpcbf-setup)
