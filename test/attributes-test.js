var QUnit = require("steal-qunit");
var CanElement = require("can-element").Element;
var defineAttr = require("can-element/attributes");
var compute = require("can-compute");
var define = require("can-define");
var stache = require("can-stache");

var helpers = require("./helpers");

function fixture(){
	return document.getElementById("qunit-fixture");
}

QUnit.module("can-custom-elements attributes", {
	teardown: function(){
		fixture().innerHTML = "";
	}
});

QUnit.test("can tag a property as an attribute", function(){
	var view = stache("{{foo}}");

	var AttrEl = class extends CanElement {
		static get view() {
			return view;
		}
	};

	define(AttrEl.prototype, {
		foo: {
			attribute: true,
			type: "string"
		}
	});

	defineAttr(AttrEl);

	customElements.define("attr-el", AttrEl);

	var el = new AttrEl();
	el.foo = "bar";

	QUnit.equal(el.getAttribute("foo"), "bar", "setting the property set the attribute as well");

	QUnit.equal(el.foo, "bar", "the property too");

	el.setAttribute("foo", "baz");

	helpers.soon(function(){
		QUnit.equal(el.getAttribute("foo"), "baz", "attr is now baz");
		QUnit.equal(el.foo, "baz", "prop is now baz");
		QUnit.start();
	});

	QUnit.stop();
});

QUnit.test("Can use 'type' to modify the type on the property", function(){
	var view = stache("{{one}}");

	var AttrEl = class extends CanElement {
		static get view() { return view; }
	};

	define(AttrEl.prototype, {
		num: {
			attribute: true,
			type: "number"
		}
	});

	defineAttr(AttrEl);

	customElements.define("attr-el-2", AttrEl);

	var el = new AttrEl();
	fixture().appendChild(el);
	el.setAttribute("num", "15");

	helpers.soon(function(){
		QUnit.deepEqual(el.getAttribute("num"), "15");
		QUnit.deepEqual(el.num, 15, "the property is a number");
		QUnit.start();
	});

	QUnit.stop();
});

QUnit.test("Properties are observable", function(){
	var view = stache("{{foo}}");

	var AttrEl = class extends CanElement {
		static get view() { return view; }
	};

	define(AttrEl.prototype, {
		foo: "string"
	});

	defineAttr(AttrEl);

	customElements.define("attr-el-3", AttrEl);

	var el = new AttrEl();

	var fooCompute = compute(function(){
		return el.foo;
	});

	QUnit.equal(fooCompute(), el.foo, "same initial value");

	fooCompute.bind("change", function(){
		QUnit.ok(true, "change event occurred");
		QUnit.start();
	});

	QUnit.stop();

	// Change it
	el.foo = "bar";
	QUnit.equal(el.foo, "bar");
	QUnit.equal(fooCompute(), "bar", "compute updated too");
});
