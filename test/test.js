var QUnit = require("steal-qunit");

var define = require("can-define");
var CanElement = require("../can-custom-elements").Element;
var stache = require("can-stache");

function fixture(){
	return document.getElementById("qunit-fixture");
}

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
	document.body.appendChild(parent);

	var child = parent.shadowRoot.querySelector("child-one");

	console.log(child.shadowRoot);

	QUnit.equal(child.foo, "bar", "data was passed from parent to child");
});
