import VuiRadioInput from "./components/input";
import VuiRadioLabel from "./components/label";
import Emitter from "vui-design/mixins/emitter";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiRadio = {
	name: "vui-radio",

	inject: {
		vuiForm: {
			default: undefined
		},
		vuiRadioGroup: {
			default: undefined
		}
	},

	components: {
		VuiRadioInput,
		VuiRadioLabel
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
		let { $vui: vui, vuiForm, vuiRadioGroup, $slots: slots, $attrs: attrs, classNamePrefix: customizedClassNamePrefix, label, value, defaultFocused, defaultChecked } = this;
		let { handleFocus, handleBlur } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "radio");

		// type: vuiRadioGroup > self
		let type;

		if (vuiRadioGroup) {
			type = vuiRadioGroup.type;
		}
		else {
			type = this.type;
		}

		// size: self > vuiRadioGroup > vuiForm > vui
		let size;

		if (this.size) {
			size = this.size;
		}
		else if (vuiRadioGroup && vuiRadioGroup.size) {
			size = vuiRadioGroup.size;
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

		// name: vuiRadioGroup > self
		let name;

		if (vuiRadioGroup) {
			name = vuiRadioGroup.name;
		}
		else {
			name = this.name;
		}

		// focused
		let focused = defaultFocused;

		// checked: vuiRadioGroup > self
		let checked;

		if (vuiRadioGroup) {
			checked = value === vuiRadioGroup.defaultValue;
		}
		else {
			checked = defaultChecked;
		}

		// disabled: vuiForm > vuiRadioGroup > self
		let disabled;

		if (vuiForm && vuiForm.disabled) {
			disabled = vuiForm.disabled;
		}
		else if (vuiRadioGroup && vuiRadioGroup.disabled) {
			disabled = vuiRadioGroup.disabled;
		}
		else {
			disabled = this.disabled;
		}

		// handleChange
		let handleChange;

		if (vuiRadioGroup) {
			handleChange = vuiRadioGroup.handleChange;
		}
		else {
			handleChange = this.handleChange;
		}

		// theRadioInputOptions
		let theRadioInputOptions = {
			props: {
				classNamePrefix,
				type,
				name,
				value,
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

		// theRadioLabelOptions
		let theRadioLabelOptions = {
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
			[`${classNamePrefix}-checked`]: checked,
			[`${classNamePrefix}-disabled`]: disabled
		};

		// render
		return (
			<label class={classes}>
				<VuiRadioInput {...theRadioInputOptions} />
				<VuiRadioLabel {...theRadioLabelOptions}>
					{slots.default || label}
				</VuiRadioLabel>
			</label>
		);
	}
};

export default VuiRadio;
