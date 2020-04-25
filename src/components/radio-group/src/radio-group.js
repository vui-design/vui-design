import VuiRadio from "vui-design/components/radio";
import Emitter from "vui-design/mixins/emitter";
import is from "vui-design/utils/is";
import guid from "vui-design/utils/guid";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiRadioGroup = {
	name: "vui-radio-group",

	inject: {
		vuiForm: {
			default: undefined
		}
	},

	provide() {
		return {
			vuiRadioGroup: this
		};
	},

	components: {
		VuiRadio
	},

	mixins: [
		Emitter
	],

	model: {
		prop: "value",
		event: "input"
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		type: {
			type: String,
			default: undefined,
			validator: value => value === "button"
		},
		size: {
			type: String,
			default: undefined,
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		vertical: {
			type: Boolean,
			default: false
		},
		name: {
			type: String,
			default: () => guid()
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
			defaultValue: this.value
		};
	},

	watch: {
		value(value) {
			if (this.defaultValue === value) {
				return;
			}

			this.defaultValue = value;
			this.dispatch("vui-form-item", "change", this.defaultValue);
		}
	},

	methods: {
		handleChange(data) {
			let value = data.value;

			this.defaultValue = value;
			this.$emit("input", this.defaultValue);
			this.$emit('change', this.defaultValue);
			this.dispatch("vui-form-item", "change", this.defaultValue);
		}
	},

	render() {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, options, vertical } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "radio-group");
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-vertical`]: vertical
		};
		let children;

		if (options && options.length > 0) {
			children = options.map(option => {
				if (is.string(option) || is.number(option)) {
					return (
						<VuiRadio key={option} value={option}>
							{option}
						</VuiRadio>
					);
				}
				else if (is.object(option)) {
					return (
						<VuiRadio key={option.value} value={option.value} disabled={option.disabled}>
							{option.label}
						</VuiRadio>
					);
				}
			});
		}
		else {
			children = slots.default;
		}

		return (
			<div class={classes}>
				{children}
			</div>
		);
	}
};

export default VuiRadioGroup;
