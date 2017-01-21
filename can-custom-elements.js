var domMutate = require("can-util/dom/mutate/mutate");
var getChildNodes = require("can-util/dom/child-nodes/child-nodes");
var nodeLists = require("can-view-nodelist");

function CustomElement(BaseElement) {
	function CanElement(){
		var self = Reflect.construct(BaseElement, arguments, this.constructor);

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

		this._nodeList = nodeLists.register([], null, true, false);
		this._nodeList.expression = "<" + this.localName + ">";

		// We only want to render once
		// but connectedCallback gets called any time the element is inserted
		// which could be N number of times.
		if(!this._rendered) {
			var Element = this.constructor;

			var frag = Element.view(this.viewModel, null, this._nodeList);

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

exports = module.exports = CustomElement;

exports.Element = CustomElement(HTMLElement);
