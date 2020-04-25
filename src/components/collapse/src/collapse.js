const VuiCollapse = {
	name: "vui-collapse",

	provide() {
		return {
			vuiCollapse: this
		};
	},

	model: {
		prop: "value",
		event: "input"
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-collapse"
		},
		value: {
			type: [Array, String, Number],
			default() {
				return this.accordion ? undefined : [];
			}
		},
		accordion: {
			type: Boolean,
			default: false
		},
		borderless: {
			type: Boolean,
			default: false
		},
		arrowAlign: {
			type: String,
			default: "left",
			validator(value) {
				return ["left", "right"].indexOf(value) > -1;
			}
		}
	},

	data() {
		return {
			currentValue: this.value
		};
	},

	watch: {
		value(value) {
			this.currentValue = value;
		}
	},

	methods: {
		handleToggle(panel) {
			let name = panel.name;

			if (this.accordion) {
				if (this.currentValue === name) {
					this.currentValue = undefined;
				}
				else {
					this.currentValue = name;
				}
			}
			else {
				let index = this.currentValue.indexOf(name);

				if (index > -1) {
					this.currentValue.splice(index, 1);
				}
				else {
					this.currentValue.push(name);
				}
			}

			this.$emit("input", this.currentValue);
			this.$emit("change", this.currentValue);
		}
	},

	render(h) {
		let { $slots, classNamePrefix, borderless } = this;
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-borderless`]: borderless
		};

		return (
			<div class={classes}>{$slots.default}</div>
		);
	}
};

export default VuiCollapse;