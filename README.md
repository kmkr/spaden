# Spaden - the FINN.no CSS framework

There is a figure of speech which is to [call a spade a spade](https://en.wikipedia.org/wiki/Call_a_spade_a_spade). This is (not) the reason this project is called Spaden.

[![travis status](https://api.travis-ci.org/finn-no/spaden.png)](https://travis-ci.org/finn-no/spaden)

[![NPM](https://nodei.co/npm/spaden.png?stars&downloads)](https://nodei.co/npm/spaden/)
[![NPM](https://nodei.co/npm-dl/spaden.png)](https://nodei.co/npm/spaden/)

## Building

	# Install dependencies
	$ npm install

	# Build artifacts
	$ npm run package

The built artifacts reside in the _/dist_ folder in the current directory.

## Post-processing

Spaden is processed with [postcss](https://github.com/postcss/postcss). The following future syntax features are used:

* Variables (postcss-custom-properties)
* Custom media queries (postcss-custom-media)
* Range contexts in media features ("`(width > 500px)`") (postcss-media-minmax)

The following features are used for building:

* Autoprefixer (autoprefixer)
* @import inlining (postcss-import)

## Legacy browser support

	<!--[if IE 9]>
	<link rel="stylesheet" href="styles/ie9.css">
	<![endif]-->
	<!--[if IE 8]>
	<link rel="stylesheet" href="styles/ie8.css">
	<![endif]-->
	<!--[if lte IE 8]>
	<link rel="stylesheet" href="styles/ie.css">
	<![endif]-->

## Using Spaden from Node.js/Express

Install Spaden via npm

	$ npm install spaden --save

Serve Spaden assets

```javascript
var app = express();
app.use('/spaden', express.static(path.join(__dirname, 'node_modules', 'spaden', 'dist')));
```

Import stylesheet

```html
<link rel="stylesheet" href="/spaden/spaden.min.css">
```

## Contributing?

Check out our [contribution guidelines](contributing.md) for the most efficient way to contribute.
