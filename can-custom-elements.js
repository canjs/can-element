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
			if(Element.ViewModel) {
				setupViewModelToElement(Element);
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

				// TODO pass in initial values
				var ViewModel = Element.ViewModel || function(){};
				this.viewModel = new ViewModel();
				
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

function setupViewModelToElement(Element) {
	if(Element._hasSetupProps) {
		return;
	}

	Element._hasSetupProps = true;

	var proto = Element.prototype;
	var vmProto = Element.ViewModel.prototype;

	if(vmProto._define) {
		var definitions = Object.keys(vmProto._define.definitions) || [];
		definitions.forEach(function(prop){
			Object.defineProperty(proto, prop, {
				get: function(){
					return this.viewModel[prop];
				},
				set: function(val){
					this.viewModel[prop] = val;
				}
			});
		});
	}
}

exports = module.exports = CustomElement;

exports.Element = CustomElement(HTMLElement);
