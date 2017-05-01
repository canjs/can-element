@typedef {{}} can-element.CanElement.view CanElement.view
@parent can-element.CanElement

A static getter that returns the renderer function used to render the element's shadow DOM.

```js
var Element = require("can-element").Element;
var view = require("./some-template.stache");

class MyApp extends Element {
	static get view() {
		return view;
	}
}

customElements.define("my-app", MyApp);
```
