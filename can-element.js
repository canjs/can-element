var makePrototypeObservable = require("./src/make-prototype-observable");
var addLifecycleMethods = require("./src/add-lifecycle-methods");
var useStacheRenderer = require("./src/use-stache-renderer");
var useDefinedProperties = require("./src/use-defined-properties");

var CustomElement = function(BaseElement = HTMLElement) {
	var CanElement = function CanElement() {
		return Reflect.construct(BaseElement, arguments, this.constructor);
	};

	// define getter/setter pairs for types/async/resolver from the class's static `definitions` property
	CanElement = useDefinedProperties( CanElement );

	// create a renderer using stache from the class's static `view` property
	CanElement = useStacheRenderer( CanElement );

	// add lifecycle methods so that prevent events from being dispatched
	// during initialization and make testing easier
	CanElement = addLifecycleMethods( CanElement );

	// trap get/set on the prototype to listen to and dispatch events on instances
	CanElement = makePrototypeObservable( CanElement );

	return CanElement;
};

module.exports = CustomElement();
