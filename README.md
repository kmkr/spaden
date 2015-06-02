# Spaden - the FINN.no CSS framework

There is a Scandinavian figure of speech which is [call a spade a spade](https://en.wikipedia.org/wiki/Call_a_spade_a_spade). The is the reason this project is called Spaden.

[![travis status](https://api.travis-ci.org/finn-no/spaden.png)](https://travis-ci.org/finn-no/spaden)

[![NPM](https://nodei.co/npm/spaden.png?stars&downloads)](https://nodei.co/npm/spaden/)
[![NPM](https://nodei.co/npm-dl/spaden.png)](https://nodei.co/npm/spaden/)

## Building

	# Install dependencies
	$ npm install

	# Build artifacts
	$ npm run package

The built artifacts reside in the _/dist_ folder in the current directory.


## Releasing

When releasing you must specify how to bump the version number. Please consult the [semver standard](http://semver.org/) if you're not certain which to choose:

	$ npm version [patch | minor | major]
	$ npm run package
	$ npm publish . --registry https://registry.npmjs.org
	$ git push --follow-tags origin master

	# Finn internal deploy
	$ node legacyDeploy.js false | true

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
app.use('/spaden', express.static(path.join(__dirname, 'node_modules', 'spaden', 'src')));
```

Import stylesheets

```html
<link rel="stylesheet" href="/spaden/styles/core/core.css">
<link rel="stylesheet" href="/spaden/styles/components/components.css">
```

## Contributing?

Check out our [contribution guidelines](contributing.md) for the most efficient way to contribute.
