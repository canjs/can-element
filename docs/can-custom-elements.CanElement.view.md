@typedef {{}} can-custom-elements.CanElement.view CanElement.view
@parent can-custom-elements.CanElement

A static getter that returns the renderer function used to render the element's shadow DOM.

```js
var Element = require("can-custom-elements").Element;
var view = require("./some-template.stache");

class MyApp extends Element {
	static get view() {
		return view;
	}
}

customElements.define("my-app", MyApp);
```
