import VuiCheckboxInput from "./components/input";
import VuiCheckboxLabel from "./components/label";

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

	inheritAttrs: false,

	model: {
		prop: "checked",
		event: "input"
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-checkbox"
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
		let { $vui, vuiForm, vuiCheckboxGroup, $slots, $attrs, classNamePrefix, label, value, indeterminate, state } = this;
		let { handleFocus, handleBlur } = this;

		// 属性 type 优先级：vuiCheckboxGroup > self
		let type;

		if (vuiCheckboxGroup) {
			type = vuiCheckboxGroup.type;
		}
		else {
			type = this.type;
		}

		// 属性 size 优先级：self > vuiCheckboxGroup > vuiForm > $vui
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
		else if ($vui && $vui.size) {
			size = $vui.size;
		}
		else {
			size = "medium";
		}

		// 属性 name 优先级：vuiCheckboxGroup > self
		let name;

		if (vuiCheckboxGroup) {
			name = vuiCheckboxGroup.name;
		}
		else {
			name = this.name;
		}

		// 属性 focused
		let focused = state.focused;

		// 属性 checked 优先级：vuiCheckboxGroup > self
		let checked;

		if (vuiCheckboxGroup) {
			checked = vuiCheckboxGroup.state.value.indexOf(value) > -1;
		}
		else {
			checked = state.checked;
		}

		// 属性 disabled 优先级：vuiForm > vuiCheckboxGroup > self
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

		// 事件 handleChange
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
				...$attrs
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
					{$slots.default || label}
				</VuiCheckboxLabel>
			</label>
		);
	}
};

export default VuiCheckbox;
