import VuiCheckbox from "vui-design/components/checkbox";
import Emitter from "vui-design/mixins/emitter";
import is from "vui-design/utils/is";
import guid from "vui-design/utils/guid";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiCheckboxGroup = {
	name: "vui-checkbox-group",

	inject: {
		vuiForm: {
			default: undefined
		}
	},

	provide() {
		return {
			vuiCheckboxGroup: this
		};
	},

	components: {
		VuiCheckbox
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
			let value = [...this.defaultValue];

			if (data.checked) {
				value.push(data.value);
			}
			else {
				let index = value.indexOf(data.value);

				value.splice(index, 1);
			}

			this.defaultValue = value;
			this.$emit("input", this.defaultValue);
			this.$emit('change', this.defaultValue);
			this.dispatch("vui-form-item", "change", this.defaultValue);
		}
	},

	render() {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, options, vertical } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "checkbox-group");
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-vertical`]: vertical
		};
		let children;

		if (options && options.length > 0) {
			children = options.map(option => {
				if (is.string(option) || is.number(option)) {
					return (
						<VuiCheckbox key={option} value={option}>
							{option}
						</VuiCheckbox>
					);
				}
				else if (is.object(option)) {
					return (
						<VuiCheckbox key={option.value} value={option.value} disabled={option.disabled}>
							{option.label}
						</VuiCheckbox>
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

export default VuiCheckboxGroup;
