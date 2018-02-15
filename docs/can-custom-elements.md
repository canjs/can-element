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
import CustomElement from "can-element";

const SuperButton = class extends CustomElement( HTMLButtonElement ) {

};

customElements.define( "super-button", SuperButton );
```

@param {HTMLElement} Element The base element from which to derive.
@return {can-element.CanElement} A derived element with CanJS behaviors added.

@body

## Use

`can-element` makes it possible to create standard custom elements (part of [web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components)).

Use can-element to create a class that can be passed into [customElements.define](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/define) to register the element in the window.

```js
import { Element } from "can-element";
import stache from "can-stache";
import define from "can-define";

const view = stache( "Hello {{name}}" );

const MyApp = class extends Element {
	static get view() {
		return view;
	}
};

define( MyApp.prototype, {
	name: {
		value: "world"
	}
} );

customElements.define( "my-app", MyApp );

const el = document.createElement( "my-app" );

el.name; // -> "world"
```
