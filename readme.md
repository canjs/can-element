# can-custom-elements

[![Build Status](https://travis-ci.org/canjs/can-custom-elements.png?branch=master)](https://travis-ci.org/canjs/can-custom-elements)
[![npm version](https://badge.fury.io/js/can-custom-elements.svg)](http://badge.fury.io/js/can-custom-elements)

## Usage

Import/require **can-custom-elements** and use the Element to derive your own classes. Calling `customElements.define` will register your element with the window's registry of custom elements.

```js
var Element = require("can-custom-elements").Element;
require("can-custom-elements/attributes");
var define = require("can-define");
var stache = require("can-stache");

var view = stache("Hello {{name}}");

class HelloWorld extends Element {
	static get view() {
		return view;
	}
}

define(HelloWorld.prototype, {
	name: {
		attribute: true,
		type: "string",
		value: "world"
	}
});

customElements.define("hello-world", HelloWorld);
```

- <code>[__can-custom-elements__ function](#can-custom-elements-function)</code>
  - <code>[CustomElement(Element)](#customelementelement)</code>
    - _can-custom-elements.properties_
    - _can-custom-elements.modules_
      - _can-custom-elements.attributes_
    - _can-custom-elements.types_
      - <code>[CanElement function](#canelement-function)</code>
        - <code>[CanElement.view Object](#canelementview-object)</code>

## API


## <code>__can-custom-elements__ function</code>
Allows you to create [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) classes with CanJS. 
Safari only supports custom elements that derive from HTMLElement, so you'll usually want to use undefined.



### <code>CustomElement(Element)</code>


Create a base Element class based on `Element`, any element that derives from [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).

**Important**: Safari only supports custom elements that derive from [HTMLElement].

```js
var CustomElement = require("can-custom-element");

var SuperButton = class extends CustomElement(HTMLButtonElement) {

};

customElements.define("super-button", SuperButton);
```


1. __Element__ <code>{HTMLElement}</code>:
  The base element from which to derive.

- __returns__ <code>{[CanElement](#canelement-function)()}</code>:
  A derived element with CanJS behaviors added.
  
#### CanElement `{function}`


An interface for derived elements using either [can-custom-elements](#customelementelement) or undefined.



##### <code>function()</code>


- __returns__ <code>{undefined}</code>:
  
##### CanElement.view `{Object}`


A static getter that returns the renderer function used to render the element's shadow DOM.



###### <code>Object</code>


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
