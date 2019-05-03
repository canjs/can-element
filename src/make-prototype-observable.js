var observe = require("can-observe");

module.exports = function makePrototypeObservable(BaseElement = HTMLElement) {
	var ObservablePrototypeElement = function ObservablePrototypeElement() {
		return Reflect.construct(BaseElement, [], this.constructor);
	};
	ObservablePrototypeElement.prototype = observe(Object.create(BaseElement.prototype));
	return ObservablePrototypeElement;
};
