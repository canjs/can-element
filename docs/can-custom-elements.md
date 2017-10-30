@module {function} can-element
@parent can-views
@collection can-ecosystem
@group can-element.properties 1 properties
@group can-element.modules 2 modules
@group can-element.types 3 types
@package ../package.json

@description Allows you to create [customelement](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements) classes with CanJS.

Safari only supports custom elements that derive from HTMLElement, so you'll usually want to use [can-element.element].

@signature `CustomElement(Element)`

Create a base Element class based on `Element`, any element that derives from [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).

**Important**: Safari only supports custom elements that derive from [HTMLElement].

```js
var CustomElement = require("can-element");

var SuperButton = class extends CustomElement(HTMLButtonElement) {

};

customElements.define("super-button", SuperButton);
```

@param {HTMLElement} Element The base element from which to derive.
@return {can-element.CanElement} A derived element with CanJS behaviors added.

@body

## Use

`can-element` makes it possible to create standard custom elements (part of [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)).

Use can-element to create a class that can be passed into [customElements.define](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) to register the element in the window.

```js
var Element = require("can-element").Element;
var stache = require("can-stache");
var define = require("can-define");

var view = stache("Hello {{name}}");

var MyApp = class extends Element {
	static get view() {
		return view;
	}
};

define(MyApp.prototype, {
	name: {
		value: "world"
	}
});

customElements.define("my-app", MyApp);

var el = document.createElement("my-app");

el.name; // -> "world"
```
