var domMutate = require("can-util/dom/mutate/mutate");
var getChildNodes = require("can-util/dom/child-nodes/child-nodes");
var nodeLists = require("can-view-nodelist");

function CustomElement(BaseElement) {
	return class extends BaseElement {
		constructor(){
			super();

			this._rendered = false;
			var Element = this.constructor;
			if(Element.view) {
				this.attachShadow({ mode: "open" });
			}
		}

		connectedCallback(){
			// What is the root from which we render?
			var root = this.shadowRoot || this;

			// We only want to render once
			// but connectedCallback gets called any time the element is inserted
			// which could be N number of times.
			if(!this._rendered) {
				var Element = this.constructor;

				var frag = Element.view(this.viewModel);

				// Append the resulting document fragment to the element
				domMutate.appendChild.call(root, frag);
				this._rendered = true;
			}

			this._nodeList = nodeLists.register([], null, true, false);
			this._nodeList.expression = "<" + this.localName + ">";
			// update the nodeList with the new children so the mapping gets applied
			nodeLists.update(this._nodeList, getChildNodes(root));
		}

		disconnectedCallback(){
			nodeLists.unregister(this._nodeList);
		}
	}
}

exports = module.exports = CustomElement;

exports.Element = CustomElement(HTMLElement);
