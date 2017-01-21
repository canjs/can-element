var QUnit = require("steal-qunit");

var define = require("can-define");
var CanCustomElement = require("../can-custom-elements");
var CanElement = CanCustomElement.Element;
var stache = require("can-stache");
var stacheBindings = require("can-stache-bindings");

// TODO yuck! need to find a better way for this
CanCustomElement.setupBindings = function(el, tagData){
	return stacheBindings.behaviors.viewModel(el, tagData, function(){}, el);
}

function fixture(){
	return document.getElementById("qunit-fixture");
}

QUnit.module("can-custom-elements ES6", {
	teardown: function() {
		fixture().innerHTML = "";
	}
});

QUnit.test("Absolute basics", function(){
	var view = stache("hello {{name}}");

	class MyApp extends CanElement {
		static get view() {
			return view;
		}
	}

	define(MyApp.prototype, {
		name: {
			value: "world"
		}
	});

	customElements.define("my-app", MyApp);

	var el = document.createElement("my-app");
	fixture().appendChild(el);

	var myApp = fixture().querySelector("my-app");

	QUnit.equal(myApp.name, "world");
	QUnit.ok(myApp instanceof HTMLElement);
	QUnit.equal(myApp.shadowRoot.textContent, "hello world");
});

QUnit.test("Can pass data to child components", function(){
	var parentView = stache("<child-one {foo}='bar'/>");
	var childView = stache("{{foo}}");

	var Child = class extends CanElement {
		static get view() {
			return childView;
		}
	}

	define(Child.prototype, {
		foo: {
			type: "string",
			value: "foo"
		}
	});

	var Parent = class extends CanElement {
		static get view() {
			return parentView;
		}
	}

	define(Parent.prototype, {
		bar: { value: "bar" }
	});
	
	customElements.define("parent-one", Parent);
	customElements.define("child-one", Child);

	var parent = document.createElement("parent-one");
	fixture().appendChild(parent);

	var child = parent.shadowRoot.querySelector("child-one");
	QUnit.equal(child.foo, "bar", "data was passed from parent to child");
	QUnit.equal(child.shadowRoot.textContent, "bar",
							"content was rendered correctly");
});

QUnit.test("Gets data from the passed in scope", function(){
	var view = stache("{{foo}}");

	var MyComponent = class extends CanElement {
		static get view() {
			return view;
		}
	}

	define(MyComponent.prototype, {
		foo: "string"
	});

	customElements.define("data-from-scope", MyComponent);

	var frag = stache("<data-from-scope {foo}='bar'/>")({
		bar: "bar"
	});
	fixture().appendChild(frag);

	var el = fixture().querySelector("data-from-scope");

	QUnit.equal(el.foo, "bar", "got data from the scope");
	QUnit.equal(el.shadowRoot.textContent, "bar");
});
