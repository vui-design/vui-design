import VuiSwitchInput from "./components/input";
import VuiSwitchLabel from "./components/label";
import Emitter from "vui-design/mixins/emitter";

const VuiSwitch = {
	name: "vui-switch",

	inject: {
		vuiForm: {
			default: undefined
		}
	},

	components: {
		VuiSwitchInput,
		VuiSwitchLabel
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
			default: "vui-switch"
		},
		size: {
			type: String,
			default: undefined,
			validator(value) {
				return ["small", "large", "medium"].indexOf(value) > -1;
			}
		},
		checked: {
			type: [Boolean, String, Number],
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
        trueValue: {
            type: [Boolean, String, Number],
            default: true
        },
        falseValue: {
            type: [Boolean, String, Number],
            default: false
        },
		validator: {
			type: Boolean,
			default: true
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
		handleChange(checked) {
			if (this.disabled || this.loading) {
				return;
			}
          
            const value = checked ? this.trueValue : this.falseValue;

			this.state.checked = value;
			this.$emit("input", value);
			this.$emit('change', value);

			if (this.validator) {
				this.dispatch("vui-form-item", "change", value);
			}
		}
	},

	render() {
		let { $vui, vuiForm, $slots, $attrs, classNamePrefix, loading, state } = this;
		let { handleFocus, handleBlur, handleChange } = this;

		// 属性 size 优先级：self > vuiForm > $vui
		let size;

		if (this.size) {
			size = this.size;
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

		// 属性 focused
		let focused = state.focused;

		// 属性 checked
		let checked = state.checked === this.trueValue;

		// 属性 disabled 优先级：vuiForm > self
		let disabled;

		if (vuiForm && vuiForm.disabled) {
			disabled = vuiForm.disabled;
		}
		else {
			disabled = this.disabled;
		}

		// theSwitchInputOptions
		let theSwitchInputOptions = {
			props: {
				classNamePrefix,
				checked,
				disabled,
				loading
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

		// theSwitchLabelOptions
		let theSwitchLabelOptions = {
			props: {
				classNamePrefix
			}
		};

		// classes
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${size}`]: size,
			[`${classNamePrefix}-focused`]: focused,
			[`${classNamePrefix}-checked`]: checked,
			[`${classNamePrefix}-disabled`]: disabled,
			[`${classNamePrefix}-loading`]: loading
		};

		// render
		return (
			<label class={classes}>
				<VuiSwitchInput {...theSwitchInputOptions} />
				<VuiSwitchLabel {...theSwitchLabelOptions}>
					{checked ? $slots.checked : $slots.unchecked}
				</VuiSwitchLabel>
			</label>
		);
	}
};

export default VuiSwitch;
