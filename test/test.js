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
});
