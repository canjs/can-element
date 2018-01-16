var element = require("../../../can-element");
require("can-stache-bindings");

element({
	tag: "my-counter",

	view: `
		<style>
			.count {
				font-weight: "bold"
			}
		</style>
		<button on:click="increment()">Increment</button>
		<span class="count">Count: {{count}}</span>
	`,

	data: {
		count: 0
	},

	methods: {
		increment() {
			this.count++;
		}
	}
});
