import VuiRadioInput from "./components/input";
import VuiRadioLabel from "./components/label";

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

	inheritAttrs: false,

	model: {
		prop: "checked",
		event: "input"
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-radio"
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
			state: {
				focused: false,
				checked: this.checked
			}
		};
	},

	watch: {
		checked(value) {
			this.state.checked = value;
		}
	},

	methods: {
		handleFocus(e) {
			this.state.focused = true;
		},
		handleBlur(e) {
			this.state.focused = false;
		},
		handleChange(data) {
			if (this.disabled) {
				return;
			}

			let checked = data.checked;

			this.state.checked = checked;
			this.$emit("input", checked);
			this.$emit('change', checked);
		}
	},

	render() {
		let { $vui, vuiForm, vuiRadioGroup, $slots, $attrs, classNamePrefix, label, value, state } = this;
		let { handleFocus, handleBlur } = this;

		// 属性 type 优先级：vuiRadioGroup > self
		let type;

		if (vuiRadioGroup) {
			type = vuiRadioGroup.type;
		}
		else {
			type = this.type;
		}

		// 属性 size 优先级：self > vuiRadioGroup > vuiForm > $vui
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
		else if ($vui && $vui.size) {
			size = $vui.size;
		}
		else {
			size = "medium";
		}

		// 属性 name 优先级：vuiRadioGroup > self
		let name;

		if (vuiRadioGroup) {
			name = vuiRadioGroup.name;
		}
		else {
			name = this.name;
		}

		// 属性 focused
		let focused = state.focused;

		// 属性 checked 优先级：vuiRadioGroup > self
		let checked;

		if (vuiRadioGroup) {
			checked = value === vuiRadioGroup.state.value;
		}
		else {
			checked = state.checked;
		}

		// 属性 disabled 优先级：vuiForm > vuiRadioGroup > self
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

		// 事件 handleChange
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
				...$attrs
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
					{$slots.default || label}
				</VuiRadioLabel>
			</label>
		);
	}
};

export default VuiRadio;
