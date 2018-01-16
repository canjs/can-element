var assign = require("can-util/js/assign/assign");
var canReflect = require("can-reflect");
var canSymbol = require("can-symbol");
var CIDSet = require("can-cid/set/set");
var domData = require("can-util/dom/data/data");
var domMutate = require("can-util/dom/mutate/mutate");
var getChildNodes = require("can-util/dom/child-nodes/child-nodes");
var GLOBAL = require("can-globals/global/global");
var KeyTree = require("can-key-tree");
var queues = require("can-queues");
var ObservationRecorder = require("can-observation-recorder");
var nodeLists = require("can-view-nodelist");
var Scope = require("can-view-scope");

var renderedSymbol = canSymbol.for("can.element.rendered");
var metaSymbol = canSymbol.for("can.element.meta");

var whitelistedProps = new CIDSet();
[renderedSymbol, metaSymbol].forEach(function(prop){
	whitelistedProps.add(prop);
});

function getView(view) {
	if(typeof view === "string") {
		var stache = require("can-stache");
		return stache(view);
	}
	// It's a function
	return view;
}

function getData(data) {
	var typeofData = typeof data;
	return typeofData === "function" ? data : typeofData === "object" ?
		function() { return data } : Function.prototype;
}

function getMeta(inst) {
	return inst[metaSymbol];
}

function element(defn) {
	var tagName = defn.tag;
	var view = getView(defn.view);
	var Base = defn.extends || GLOBAL().HTMLElement;
	var getInitialData = getData(defn.data);

	function Meta() {
		this.handlers = new KeyTree([Object, Object, Array]);
		this.props = Object.create(null);
	}

	function Element() {
		var self = Reflect.construct(Base, arguments, this.constructor);

		self[renderedSymbol] = false;
		self[metaSymbol] = new Meta();
		self.attachShadow({mode:"open"});

		assign(self, getInitialData());

		return self;
	}

	var proto = Object.create(Base.prototype);
	proto.constructor = Element;
	proto.connectedCallback = function(){
		if(!this[renderedSymbol]) {
			// setup our nodeList
			this._nodeList = nodeLists.register([], null, true, false);
			this._nodeList.expression = "<" + this.localName + ">";

			var scope = new Scope(this);
			var frag = view(scope, null, this._nodeList);

			// Append the resulting document fragment to the element
			domMutate.appendChild.call(this.shadowRoot, frag);
			this[renderedSymbol] = true;
		}
	};

	canReflect.assignSymbols(proto, {
		"can.getKeyValue": function(key){
			return this[key];
		},
		"can.setKeyValue": function(key, value){
			this[key] = value;
		},
		"can.onKeyValue": function(key, handler, queueName) {
			getMeta(this).handlers.add([key, queueName || "mutate", handler]);
		},
		"can.offKeyValue": function(key, handler, queueName){
			getMeta(this).handlers.remove([key, queueName || "mutate", handler]);
		}
	});

	assign(proto, defn.methods);

	var proxyHandlers = {
		get: function(target, key, receiver) {
			var value;

			if(whitelistedProps.has(key)) {
				value = Reflect.get(target, key, receiver);
				return value;
			}

			var meta = getMeta(receiver);
			if(meta && key in meta.props) {
				value = meta.props[key];
			} else {
				value = Reflect.get(target, key, receiver);
			}

			ObservationRecorder.add(this, key);
			return value;
		},
		has: function(target, key){
			var meta = getMeta(target);
			if(meta && key in meta) {
				return true;
			}
			return Reflect.has(target, key);
		},
		set: function(target, key, value, receiver) {
			var oldValue = Reflect.get(target, key, receiver);

			if(whitelistedProps.has(key)) {
				Reflect.set(target, key, value, receiver);
				return true;
			}

			var meta = getMeta(receiver);

			// Set the value on the meta.
			getMeta(receiver).props[key] = value;

			if(value !== oldValue) {
				var handlers = getMeta(receiver).handlers.getNode([]);

				queues.enqueueByQueue(handlers, receiver, [value, oldValue]
					//!steal-remove-start
					/* jshint laxcomma: true */
					, null
					, [ canReflect.getName(receiver), "changed to", value, "from", oldValue ]
					/* jshint laxcomma: false */
					//!steal-remove-end
				);
			}

			return true;
		}
	};

	Element.prototype = new Proxy(proto, proxyHandlers);

	if(tagName) {
		customElements.define(tagName, Element);
	}

	return Element;
}

module.exports = element;

/*
function CustomElement(BaseElement) {
	function CanElement(){
		var self = Reflect.construct(BaseElement, arguments, this.constructor);

		self._rendered = false;
		var Element = self.constructor;
		if(Element.view) {
			self.attachShadow({ mode: "open" });
		}

		// Mark the element as its own viewModel for binding purposes
		var existingViewModel = domData.get.call(self, "viewModel");
		if(existingViewModel) {
			assign(self, existingViewModel.get());
		}
		domData.set.call(self, "viewModel", self);

		return self;
	}

	CanElement.prototype = Object.create(BaseElement.prototype);
	CanElement.prototype.constructor = CanElement;

	var proto = CanElement.prototype;

	proto.connectedCallback = function(){
		// What is the root from which we render?
		var root = this.shadowRoot || this;

		// We only want to render once but connectedCallback gets called
		// any time the element is inserted which could be N number of times.
		if(!this._rendered) {
			// setup our nodeList
			this._nodeList = nodeLists.register([], null, true, false);
			this._nodeList.expression = "<" + this.localName + ">";

			var Element = this.constructor;
			var scope = new Scope(this);
			var frag = Element.view(scope, null, this._nodeList);

			// Append the resulting document fragment to the element
			domMutate.appendChild.call(root, frag);
			this._rendered = true;
		}

		// update the nodeList with the new children so the mapping gets applied
		nodeLists.update(this._nodeList, getChildNodes(root));
	};

	proto.disconnectedCallback = function(){
		nodeLists.unregister(this._nodeList);
	};

	Object.defineProperty(CanElement, "observedAttributes", {
		get: function(){
			return this._observedAttributes || [];
		}
	});

	proto.attributeChangedCallback = function(attr, oldVal, newVal){
		this[attr] = newVal;
	};

	return CanElement;
}

exports = module.exports = CustomElement;

exports.Element = CustomElement(HTMLElement);
*/
