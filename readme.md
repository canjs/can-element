# can-custom-elements

[![Build Status](https://travis-ci.org//can-custom-elements.png?branch=master)](https://travis-ci.org//can-custom-elements)



## Usage

### ES6 use

With StealJS, you can import this module directly in a template that is autorendered:

```js
import plugin from 'can-custom-elements';
```

### CommonJS use

Use `require` to load `can-custom-elements` and everything else
needed to create a template that uses `can-custom-elements`:

```js
var plugin = require("can-custom-elements");
```

## AMD use

Configure the `can` and `jquery` paths and the `can-custom-elements` package:

```html
<script src="require.js"></script>
<script>
	require.config({
	    paths: {
	        "jquery": "node_modules/jquery/dist/jquery",
	        "can": "node_modules/canjs/dist/amd/can"
	    },
	    packages: [{
		    	name: 'can-custom-elements',
		    	location: 'node_modules/can-custom-elements/dist/amd',
		    	main: 'lib/can-custom-elements'
	    }]
	});
	require(["main-amd"], function(){});
</script>
```

### Standalone use

Load the `global` version of the plugin:

```html
<script src='./node_modules/can-custom-elements/dist/global/can-custom-elements.js'></script>
```

## Contributing

### Making a Build

To make a build of the distributables into `dist/` in the cloned repository run

```
npm install
node build
```

### Running the tests

Tests can run in the browser by opening a webserver and visiting the `test.html` page.
Automated tests that run the tests from the command line in Firefox can be run with

```
npm test
```
