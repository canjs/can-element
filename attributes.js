var assign = require("can-util/js/assign/assign");
var define = require("can-define");
var each = require("can-util/js/each/each");

function addToObservedAttrs(Element, prop) {
	if(!Element._observedAttributes) {
		Element._observedAttributes = [];
	}
	Element._observedAttributes.push(prop);
}

var decorator = function(Type){
	var definitions = Type.prototype._define.definitions,
		dataInitializers = Type.prototype._define.dataInitializers,
		computedInitializers = Type.prototype._define.computedInitializers;

	each(definitions, function(definition, property){
		var attrDefinition = definition.attribute;
		if(attrDefinition) {
			addToObservedAttrs(Type, property);

			var newDefinition = assign(definition, {
				set: function(val){
					var hasChanged = this._data[property] !== val;

					if(hasChanged) {
						this._data[property] = val;
						this.setAttribute(property, val);
					}
				},
				get: function(){
					return this._data[property];
				}
			});
			define.property(Type.prototype, property, newDefinition,
				dataInitializers, computedInitializers);
		}
	});
};

module.exports = decorator;
