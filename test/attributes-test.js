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
	afterEach: function(assert) {
		fixture().innerHTML = "";
	}
});

QUnit.test("can tag a property as an attribute", function(assert) {
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

	assert.equal(el.getAttribute("foo"), "bar", "setting the property set the attribute as well");

	assert.equal(el.foo, "bar", "the property too");

	el.setAttribute("foo", "baz");

	helpers.soon(function(){
		assert.equal(el.getAttribute("foo"), "baz", "attr is now baz");
		assert.equal(el.foo, "baz", "prop is now baz");
		done();
	});

	var done = assert.async();
});

QUnit.test("Can use 'type' to modify the type on the property", function(assert) {
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
		assert.deepEqual(el.getAttribute("num"), "15");
		assert.deepEqual(el.num, 15, "the property is a number");
		done();
	});

	var done = assert.async();
});

QUnit.test("Properties are observable", function(assert) {
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

	assert.equal(fooCompute(), el.foo, "same initial value");

	fooCompute.bind("change", function(){
		assert.ok(true, "change event occurred");
		done();
	});

	var done = assert.async();

	// Change it
	el.foo = "bar";
	assert.equal(el.foo, "bar");
	assert.equal(fooCompute(), "bar", "compute updated too");
});
