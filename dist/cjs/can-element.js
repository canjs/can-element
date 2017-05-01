/*can-element@0.1.2#can-element*/
var assign = require('can-util/js/assign/assign');
var domData = require('can-util/dom/data/data');
var domMutate = require('can-util/dom/mutate/mutate');
var getChildNodes = require('can-util/dom/child-nodes/child-nodes');
var nodeLists = require('can-view-nodelist');
var Scope = require('can-view-scope');
function CustomElement(BaseElement) {
    function CanElement() {
        var self = Reflect.construct(BaseElement, arguments, this.constructor);
        self._rendered = false;
        var Element = self.constructor;
        if (Element.view) {
            self.attachShadow({ mode: 'open' });
        }
        var existingViewModel = domData.get.call(self, 'viewModel');
        if (existingViewModel) {
            assign(self, existingViewModel.get());
        }
        domData.set.call(self, 'viewModel', self);
        return self;
    }
    CanElement.prototype = Object.create(BaseElement.prototype);
    CanElement.prototype.constructor = CanElement;
    var proto = CanElement.prototype;
    proto.connectedCallback = function () {
        var root = this.shadowRoot || this;
        if (!this._rendered) {
            this._nodeList = nodeLists.register([], null, true, false);
            this._nodeList.expression = '<' + this.localName + '>';
            var Element = this.constructor;
            var scope = new Scope(this);
            var frag = Element.view(scope, null, this._nodeList);
            domMutate.appendChild.call(root, frag);
            this._rendered = true;
        }
        nodeLists.update(this._nodeList, getChildNodes(root));
    };
    proto.disconnectedCallback = function () {
        nodeLists.unregister(this._nodeList);
    };
    Object.defineProperty(CanElement, 'observedAttributes', {
        get: function () {
            return this._observedAttributes || [];
        }
    });
    proto.attributeChangedCallback = function (attr, oldVal, newVal) {
        this[attr] = newVal;
    };
    return CanElement;
}
exports = module.exports = CustomElement;
exports.Element = CustomElement(HTMLElement);