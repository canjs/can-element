/*[global-shim-start]*/
(function(exports, global, doEval) {
	// jshint ignore:line
	var origDefine = global.define;

	var get = function(name) {
		var parts = name.split("."),
			cur = global,
			i;
		for (i = 0; i < parts.length; i++) {
			if (!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val) {
		var parts = name.split("."),
			cur = global,
			i,
			part,
			next;
		for (i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if (!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var useDefault = function(mod) {
		if (!mod || !mod.__esModule) return false;
		var esProps = { __esModule: true, default: true };
		for (var p in mod) {
			if (!esProps[p]) return false;
		}
		return true;
	};

	var hasCjsDependencies = function(deps) {
		return (
			deps[0] === "require" && deps[1] === "exports" && deps[2] === "module"
		);
	};

	var modules =
		(global.define && global.define.modules) ||
		(global._define && global._define.modules) ||
		{};
	var ourDefine = (global.define = function(moduleName, deps, callback) {
		var module;
		if (typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for (i = 0; i < deps.length; i++) {
			args.push(
				exports[deps[i]]
					? get(exports[deps[i]])
					: modules[deps[i]] || get(deps[i])
			);
		}
		// CJS has no dependencies but 3 callback arguments
		if (hasCjsDependencies(deps) || (!deps.length && callback.length)) {
			module = { exports: {} };
			args[0] = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args[1] = module.exports;
			args[2] = module;
		} else if (!args[0] && deps[0] === "exports") {
			// Babel uses the exports and module object.
			module = { exports: {} };
			args[0] = module.exports;
			if (deps[1] === "module") {
				args[1] = module;
			}
		} else if (!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if (globalExport && !get(globalExport)) {
			if (useDefault(result)) {
				result = result["default"];
			}
			set(globalExport, result);
		}
	});
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function() {
		// shim for @@global-helpers
		var noop = function() {};
		return {
			get: function() {
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load) {
				doEval(__load.source, global);
			}
		};
	});
})(
	{},
	typeof self == "object" && self.Object == Object ? self : window,
	function(__$source__, __$global__) {
		// jshint ignore:line
		eval("(function() { " + __$source__ + " \n }).call(__$global__);");
	}
);

/*can-element@0.2.0#can-element*/
define('can-element', [
    'require',
    'exports',
    'module',
    'can-util/js/assign/assign',
    'can-util/dom/data/data',
    'can-util/dom/mutate/mutate',
    'can-util/dom/child-nodes/child-nodes',
    'can-view-nodelist',
    'can-view-scope'
], function (require, exports, module) {
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
});
/*[global-shim-end]*/
(function(global) { // jshint ignore:line
	global._define = global.define;
	global.define = global.define.orig;
}
)(typeof self == "object" && self.Object == Object ? self : window);