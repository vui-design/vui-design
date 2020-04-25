import VuiCheckboxInput from "./components/input";
import VuiCheckboxLabel from "./components/label";
import Emitter from "vui-design/mixins/emitter";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiCheckbox = {
	name: "vui-checkbox",

	inject: {
		vuiForm: {
			default: undefined
		},
		vuiCheckboxGroup: {
			default: undefined
		}
	},

	components: {
		VuiCheckboxInput,
		VuiCheckboxLabel
	},

	mixins: [
		Emitter
	],

	inheritAttrs: false,

	model: {
		prop: "checked",
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
		name: {
			type: String,
			default: undefined
		},
		label: {
			type: [String, Number],
			default: undefined
		},
		value: {
			type: [String, Number],
			default: undefined
		},
		indeterminate: {
			type: Boolean,
			default: false
		},
		checked: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			defaultFocused: false,
			defaultChecked: this.checked
		};
	},

	watch: {
		checked(value) {
			if (this.defaultChecked === value) {
				return;
			}

			this.defaultChecked = value;
			this.dispatch("vui-form-item", "change", this.defaultChecked);
		}
	},

	methods: {
		handleFocus(e) {
			this.defaultFocused = true;
		},
		handleBlur(e) {
			this.defaultFocused = false;
		},
		handleChange(data) {
			if (this.disabled) {
				return;
			}

			this.defaultChecked = data.checked;
			this.$emit("input", this.defaultChecked);
			this.$emit('change', this.defaultChecked);
			this.dispatch("vui-form-item", "change", this.defaultChecked);
		}
	},

	render() {
		let { $vui: vui, vuiForm, vuiCheckboxGroup, $slots: slots, $attrs: attrs, classNamePrefix: customizedClassNamePrefix, label, value, indeterminate, defaultFocused, defaultChecked } = this;
		let { handleFocus, handleBlur } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "checkbox");

		// type: vuiCheckboxGroup > self
		let type;

		if (vuiCheckboxGroup) {
			type = vuiCheckboxGroup.type;
		}
		else {
			type = this.type;
		}

		// size: self > vuiCheckboxGroup > vuiForm > vui
		let size;

		if (this.size) {
			size = this.size;
		}
		else if (vuiCheckboxGroup && vuiCheckboxGroup.size) {
			size = vuiCheckboxGroup.size;
		}
		else if (vuiForm && vuiForm.size) {
			size = vuiForm.size;
		}
		else if (vui && vui.size) {
			size = vui.size;
		}
		else {
			size = "medium";
		}

		// name: vuiCheckboxGroup > self
		let name;

		if (vuiCheckboxGroup) {
			name = vuiCheckboxGroup.name;
		}
		else {
			name = this.name;
		}

		// focused
		let focused = defaultFocused;

		// checked: vuiCheckboxGroup > self
		let checked;

		if (vuiCheckboxGroup) {
			checked = vuiCheckboxGroup.defaultValue.indexOf(value) > -1;
		}
		else {
			checked = defaultChecked;
		}

		// disabled: vuiForm > vuiCheckboxGroup > self
		let disabled;

		if (vuiForm && vuiForm.disabled) {
			disabled = vuiForm.disabled;
		}
		else if (vuiCheckboxGroup && vuiCheckboxGroup.disabled) {
			disabled = vuiCheckboxGroup.disabled;
		}
		else {
			disabled = this.disabled;
		}

		// handleChange
		let handleChange;

		if (vuiCheckboxGroup) {
			handleChange = vuiCheckboxGroup.handleChange;
		}
		else {
			handleChange = this.handleChange;
		}

		// theCheckboxInputOptions
		let theCheckboxInputOptions = {
			props: {
				classNamePrefix,
				type,
				name,
				value,
				indeterminate,
				checked,
				disabled
			},
			attrs: {
				...attrs
			},
			on: {
				focus: handleFocus,
				blur: handleBlur,
				change: handleChange
			}
		};

		// theCheckboxLabelOptions
		let theCheckboxLabelOptions = {
			props: {
				classNamePrefix
			}
		};

		// classes
		let classes = {
			[`${classNamePrefix}`]: !type,
			[`${classNamePrefix}-${type}`]: type,
			[`${classNamePrefix}-${size}`]: size,
			[`${classNamePrefix}-focused`]: focused,
			[`${classNamePrefix}-indeterminate`]: indeterminate,
			[`${classNamePrefix}-checked`]: checked,
			[`${classNamePrefix}-disabled`]: disabled
		};

		// render
		return (
			<label class={classes}>
				<VuiCheckboxInput {...theCheckboxInputOptions} />
				<VuiCheckboxLabel {...theCheckboxLabelOptions}>
					{slots.default || label}
				</VuiCheckboxLabel>
			</label>
		);
	}
};

export default VuiCheckbox;
