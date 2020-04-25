import VuiRadio from "vui-design/components/radio";
import is from "vui-design/utils/is";
import guid from "vui-design/utils/guid";

const VuiRadioGroup = {
	name: "vui-radio-group",

	provide() {
		return {
			vuiRadioGroup: this
		};
	},

	components: {
		VuiRadio
	},

	model: {
		prop: "value",
		event: "input"
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-radio-group"
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
			type: [String, Number],
			default: undefined
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
			let value = data.value;

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
						<VuiRadio key={index} value={option}>
							{option}
						</VuiRadio>
					);
				}
				else {
					return (
						<VuiRadio key={index} value={option.value} disabled={option.disabled}>
							{option.label}
						</VuiRadio>
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

export default VuiRadioGroup;
