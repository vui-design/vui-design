import VuiCheckbox from "vui-design/components/checkbox";
import is from "vui-design/utils/is";
import guid from "vui-design/utils/guid";

const VuiCheckboxGroup = {
	name: "vui-checkbox-group",

	provide() {
		return {
			vuiCheckboxGroup: this
		};
	},

	components: {
		VuiCheckbox
	},

	model: {
		prop: "value",
		event: "input"
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-checkbox-group"
		},
		type: {
			type: String,
			default: undefined,
			validator(value) {
				return value === "button";
			}
		},
		size: {
			type: String,
			default: undefined,
			validator(value) {
				return ["small", "medium", "large"].indexOf(value) > -1;
			}
		},
		vertical: {
			type: Boolean,
			default: false
		},
		name: {
			type: String,
			default() {
				return guid();
			}
		},
		options: {
			type: Array,
			default: () => []
		},
		value: {
			type: Array,
			default: () => []
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			state: {
				value: this.value
			}
		};
	},

	watch: {
		value(value) {
			this.state.value = value;
		}
	},

	methods: {
		handleChange(data) {
			let value = [...this.state.value];

			if (data.checked) {
				value.push(data.value);
			}
			else {
				let index = value.indexOf(data.value);

				value.splice(index, 1);
			}

			this.state.value = value;
			this.$emit("input", value);
			this.$emit('change', value);
		}
	},

	render() {
		let { $slots, classNamePrefix, options, vertical } = this;
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-vertical`]: vertical
		};
		let children;

		if (options && options.length > 0) {
			children = options.map((option, index) => {
				if (is.string(option)) {
					return (
						<VuiCheckbox key={index} value={option}>
							{option}
						</VuiCheckbox>
					);
				}
				else {
					return (
						<VuiCheckbox key={index} value={option.value} disabled={option.disabled}>
							{option.label}
						</VuiCheckbox>
					);
				}
			});
		}
		else {
			children = $slots.default;
		}

		return (
			<div class={classes}>
				{children}
			</div>
		);
	}
};

export default VuiCheckboxGroup;
