@function can-custom-elements.element Element
@parent can-custom-elements.properties
@description A class that can be extended to create custom elements.

Element is a [can-custom-elements.CanElement] that is derived from the [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement). This is the element you will want to use to derive your own custom elements.

@body

## Use

To use this element, just extend your own element based off of it:

```js
var Element = require("can-custom-elements").Element;

class MyElement extends Element {
  ...
}
```

This element uses the [can-custom-elements.CanElement] interface, so any properties of CanElement are supported.
