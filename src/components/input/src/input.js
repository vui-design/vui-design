import VuiIcon from "vui-design/components/icon";
import Emitter from "vui-design/mixins/emitter";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiInput = {
	name: "vui-input",

	inject: {
		vuiForm: {
			default: undefined
		},
		vuiInputGroup: {
			default: undefined
		}
	},

	components: {
		VuiIcon
	},

	mixins: [
		Emitter
	],

	inheritAttrs: false,

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		type: {
			type: String,
			default: "text"
		},
		prepend: {
			type: String,
			default: undefined
		},
		append: {
			type: String,
			default: undefined
		},
		prefix: {
			type: String,
			default: undefined
		},
		suffix: {
			type: String,
			default: undefined
		},
		size: {
			type: String,
			default: undefined,
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		placeholder: {
			type: [String, Number],
			default: undefined
		},
		value: {
			type: [String, Number],
			default: undefined
		},
		maxLength: {
			type: [String, Number],
			default: undefined
		},
		clearable: {
			type: Boolean,
			default: false
		},
		showPasswordToggler: {
			type: Boolean,
			default: false
		},
		readonly: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		validator: {
			type: Boolean,
			default: true
		}
	},

	data() {
		return {
			showPassword: false,
			defaultValue: this.value
		};
	},

	watch: {
		value(value) {
			if (this.defaultValue === value) {
				return;
			}

			this.defaultValue = value;

			if (this.validator) {
				this.dispatch("vui-form-item", "change", this.defaultValue);
			}
		}
	},

	methods: {
		focus() {
			this.$refs.input.focus();
		},
		blur() {
			this.$refs.input.blur();
		},

		handleMouseenter(e) {
			this.$emit("mouseenter", e);
		},
		handleMouseleave(e) {
			this.$emit("mouseleave", e);
		},
		handleFocus(e) {
			this.$emit("focus", e);
		},
		handleBlur(e) {
			this.$emit("blur", e);

			if (this.validator) {
				this.dispatch("vui-form-item", "blur", this.defaultValue);
			}
		},
		handleKeydown(e) {
			this.$emit("keydown", e);
		},
		handleKeyup(e) {
			this.$emit("keyup", e);
		},
		handleChange(e) {
			this.$emit("change", e);
		},
		handleInput(e) {
			this.defaultValue = e.target.value;
			this.$emit("input", this.defaultValue);

			if (this.validator) {
				this.dispatch("vui-form-item", "change", this.defaultValue);
			}
		},
		handleClear(e) {
			this.defaultValue = "";
			this.focus();
			this.$emit("clear", e);
			this.$emit("input", this.defaultValue);
			this.$emit("change", e);

			if (this.validator) {
				this.dispatch("vui-form-item", "change", this.defaultValue);
			}
		},
		handleToggle(e) {
			this.showPassword = !this.showPassword;
		}
	},

	render(h) {
		let { $vui: vui, vuiForm, vuiInputGroup, $slots: slots, $attrs: attrs, $listeners: listeners, classNamePrefix: customizedClassNamePrefix, placeholder, defaultValue, maxLength, clearable, showPasswordToggler, readonly } = this;
		let { handleMouseenter, handleMouseleave, handleFocus, handleBlur, handleKeydown, handleKeypress, handleKeyup, handleChange, handleInput, handleClear, handleToggle } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "input");

		// type
		let type;

		if (this.type === "password" && this.showPassword) {
			type = "text";
		}
		else {
			type = this.type;
		}

		// size: self > vuiInputGroup > vuiForm > vui
		let size;

		if (this.size) {
			size = this.size;
		}
		else if (vuiInputGroup && vuiInputGroup.size) {
			size = vuiInputGroup.size;
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

		// disabled: vuiForm > vuiInputGroup > self
		let disabled;

		if (vuiForm && vuiForm.disabled) {
			disabled = vuiForm.disabled;
		}
		else if (vuiInputGroup && vuiInputGroup.disabled) {
			disabled = vuiInputGroup.disabled;
		}
		else {
			disabled = this.disabled;
		}

		// classes
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${size}`]: size,
			[`${classNamePrefix}-disabled`]: disabled
		};
		classes.elPrepend = `${classNamePrefix}-prepend`;
		classes.elAppend = `${classNamePrefix}-append`;
		classes.elMain = `${classNamePrefix}-main`;
		classes.elPrefix = `${classNamePrefix}-main-prefix`;
		classes.elSuffix = `${classNamePrefix}-main-suffix`;
		classes.elBtnToggle = `${classNamePrefix}-btn-toggle`;
		classes.elBtnClear = `${classNamePrefix}-btn-clear`;

		// render
		let prepend = slots.prepend || this.prepend;
		let append = slots.append || this.append;
		let prefix;
		let suffix;

		if (slots.prefix) {
			prefix = slots.prefix;
		}
		else if (this.prefix) {
			prefix = (
				<VuiIcon type={this.prefix} />
			);
		}

		if (clearable && !readonly && !disabled && defaultValue !== "") {
			let btnClearProps = {
				props: {
					type: "crossmark-circle-filled"
				},
				class: classes.elBtnClear,
				on: {
					mousedown: e => e.preventDefault(),
					click: handleClear
				}
			};

			suffix = (
				<VuiIcon {...btnClearProps} />
			);
		}
		else if (this.type === "password" && showPasswordToggler && !readonly && !disabled) {
			let btnToggleProps = {
				props: {
					type: this.showPassword ? "eye-off" : "eye"
				},
				class: classes.elBtnToggle,
				on: {
					mousedown: e => e.preventDefault(),
					click: handleToggle
				}
			};

			suffix = (
				<VuiIcon {...btnToggleProps} />
			);
		}
		else if (slots.suffix) {
			suffix = slots.suffix;
		}
		else if (this.suffix) {
			suffix = (
				<VuiIcon type={this.suffix} />
			);
		}

		let nativeInputProps = {
			ref: "input",
			attrs: {
				...attrs
			},
			on: {
				...listeners,
				mouseenter: handleMouseenter,
				mouseleave: handleMouseleave,
				focus: handleFocus,
				blur: handleBlur,
				keydown: handleKeydown,
				keyup: handleKeyup,
				change: handleChange,
				input: handleInput
			}
		};

		return (
			<div class={classes.el}>
				{
					prepend && (
						<div class={classes.elPrepend}>{prepend}</div>
					)
				}
				<div class={classes.elMain}>
					{
						prefix && (
							<div class={classes.elPrefix}>{prefix}</div>
						)
					}
					<input ref="input" {...nativeInputProps} type={type} placeholder={placeholder} value={defaultValue} maxLength={maxLength} readonly={readonly} disabled={disabled} />
					{
						suffix && (
							<div class={classes.elSuffix}>{suffix}</div>
						)
					}
				</div>
				{
					append && (
						<div class={classes.elAppend}>{append}</div>
					)
				}
			</div>
		);
	}
};

export default VuiInput;