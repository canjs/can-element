var domMutate = require("can-util/dom/mutate/mutate");
var getChildNodes = require("can-util/dom/child-nodes/child-nodes");
var nodeLists = require("can-view-nodelist");
var Scope = require("can-view-scope");

function CustomElement(BaseElement) {
	function CanElement(){
		var self = Reflect.construct(BaseElement, arguments, this.constructor);

		self._scope = peek(scopeStack);

		self._rendered = false;
		var Element = self.constructor;
		if(Element.view) {
			self.attachShadow({ mode: "open" });
		}

		return self;
	}

	CanElement.prototype = Object.create(BaseElement.prototype);
	CanElement.prototype.constructor = CanElement;

	var proto = CanElement.prototype;

	proto.connectedCallback = function(){
		// What is the root from which we render?
		var root = this.shadowRoot || this;

		// We only want to render once
		// but connectedCallback gets called any time the element is inserted
		// which could be N number of times.
		if(!this._rendered) {
			var tagData = {
				scope: this._scope || new Scope()
			};

			var teardownBindings = exports.setupBindings(this, tagData);

			// setup our nodeList
			this._nodeList = nodeLists.register([], teardownBindings, true, false);
			this._nodeList.expression = "<" + this.localName + ">";

			var Element = this.constructor;
			var scope = new Scope(this);
			scopeStack.push(scope);
			var frag = Element.view(this, null, this._nodeList);
			scopeStack.pop();

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

	return CanElement;
}

var scopeStack = [];

function peek(arr) {
	return arr[arr.length - 1];
}

exports = module.exports = CustomElement;

exports.Element = CustomElement(HTMLElement);
