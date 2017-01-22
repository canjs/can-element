var define = require("can-define");

var oldExtensions = define.extensions;
define.behaviors.push("attribute");

define.extensions = function(proto, prop, definition){
	if(definition.attribute){
		addToObservedAttrs(proto.constructor, prop);

		return {
			type: definition.type,
			set: function(val){
				var hasChanged = this._data[prop] !== val;

				if(hasChanged) {
					this._data[prop] = val;
					this.setAttribute(prop, val);
				}
			},
			get: function(){
				return this._data[prop];
			}
		};
	}
	
	return oldExtensions.apply(this, arguments);
};

function addToObservedAttrs(Element, prop) {
	if(!Element._observedAttributes) {
		Element._observedAttributes = [];
	}
	Element._observedAttributes.push(prop);
}
