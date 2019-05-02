var observe = require("can-observe");
var canSymbol = require("can-symbol");

var viewModelSymbol = canSymbol.for("can.viewModel");
var proxyMetaSymbol = canSymbol.for("can.proxyMeta");

function observable(BaseElement = HTMLElement) {
	var ChildElement = function ChildElement() {
		return Reflect.construct(BaseElement, [], this.constructor);
	};

	ChildElement.prototype = observe(Object.create(BaseElement.prototype));

	// can-stache-bindings uses viewModel symbol
	Object.defineProperty(ChildElement.prototype, viewModelSymbol, {
		get() {
			var metadata = this[proxyMetaSymbol];
			return metadata && metadata.target;
		}
	});

	return ChildElement;
}

var CanElement = observable(HTMLElement);

module.exports = CanElement;
