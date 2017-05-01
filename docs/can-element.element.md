@function can-element.element Element
@parent can-element.properties
@description A class that can be extended to create custom elements.

Element is a [can-element.CanElement] that is derived from the [HTMLElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement). This is the element you will want to use to derive your own custom elements.

@body

## Use

To use this element, just extend your own element based off of it:

```js
var Element = require("can-element").Element;

class MyElement extends Element {
  ...
}
```

This element uses the [can-element.CanElement] interface, so any properties of CanElement are supported.
