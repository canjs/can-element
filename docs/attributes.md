@module {{}} can-element/attributes
@parent can-element.modules

Sets up attribute bindings when using [can-define].

@option {Boolean} [attribute] Defines if this property should be bound to the attribute of the same name.

@body

## Use

To use this [can-define] behavior just import it. For any defined property on the element, you can specify `attribute: true` and the property will be two-way bound to the attribute. Any change in either will update the other.

Since the [can-define.types.type] can still be specified, you can have properties which are typed even though the attribute will always be a string.

```js
import define from "can-define";
import { Element } from "can-element";
import view from "./calc.stache";
import defineAttr from "can-element/attributes";

const Calculator = class extends Element {
	static get view() {
		return view;
	}
};

define( Calculator.prototype, {
	num: {
		type: "number",
		attribute: true
	}
} );

defineAttr( Calculator );

customElements.define( "my-calculator", Calculator );

const el = new Calculator();

el.setAttribute( "num", "34" );

el.num; // -> 34
```
