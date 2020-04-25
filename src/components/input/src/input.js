import VuiIcon from "vui-design/components/icon";

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

	inheritAttrs: false,

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-input"
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
		togglable: {
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
		}
	},

	data() {
		return {
			showPlaintextPassword: false,
			defaultValue: this.value
		};
	},

	watch: {
		value(value) {
			this.defaultValue = value;
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
		},
		handleClear(e) {
			this.defaultValue = "";
			this.focus();
			this.$emit("change", e);
			this.$emit("clear", e);
			this.$emit("input", this.defaultValue);
		},
		handleToggle(e) {
			this.showPlaintextPassword = !this.showPlaintextPassword;
		}
	},

	render(h) {
		let { $vui, vuiForm, vuiInputGroup, $slots, $attrs, $listeners, classNamePrefix, placeholder, defaultValue, maxLength, clearable, togglable, readonly } = this;
		let { handleMouseenter, handleMouseleave, handleFocus, handleBlur, handleKeydown, handleKeypress, handleKeyup, handleChange, handleInput, handleClear, handleToggle } = this;

		// 属性 type
		let type;

		if (this.type === "password" && this.showPlaintextPassword) {
			type = "text";
		}
		else {
			type = this.type;
		}

		// 属性 size 优先级：self > vuiInputGroup > vuiForm > $vui
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
		else if ($vui && $vui.size) {
			size = $vui.size;
		}
		else {
			size = "medium";
		}

		// 属性 disabled 优先级：vuiForm > vuiInputGroup > self
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

		// 样式
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${size}`]: size,
			[`${classNamePrefix}-disabled`]: disabled
		};
		classes.prepend = `${classNamePrefix}-prepend`;
		classes.append = `${classNamePrefix}-append`;
		classes.main = {
			[`${classNamePrefix}-main`]: true
		};
		classes.prefix = `${classNamePrefix}-main-prefix`;
		classes.suffix = `${classNamePrefix}-main-suffix`;
		classes.btnToggle = `${classNamePrefix}-btn-toggle`;
		classes.btnClear = `${classNamePrefix}-btn-clear`;

		// 渲染结构
		let prepend = $slots.prepend || this.prepend;
		let append = $slots.append || this.append;
		let prefix;
		let suffix;

		if ($slots.prefix) {
			prefix = $slots.prefix;
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
				class: classes.btnClear,
				on: {
					mousedown: e => e.preventDefault(),
					click: handleClear
				}
			};

			suffix = (
				<VuiIcon {...btnClearProps} />
			);
		}
		else if (this.type === "password" && togglable && !readonly && !disabled) {
			let btnToggleProps = {
				props: {
					type: this.showPlaintextPassword ? "eye-off" : "eye"
				},
				class: classes.btnToggle,
				on: {
					mousedown: e => e.preventDefault(),
					click: handleToggle
				}
			};

			suffix = (
				<VuiIcon {...btnToggleProps} />
			);
		}
		else if ($slots.suffix) {
			suffix = $slots.suffix;
		}
		else if (this.suffix) {
			suffix = (
				<VuiIcon type={this.suffix} />
			);
		}

		let nativeInputProps = {
			ref: "input",
			attrs: {
				...$attrs
			},
			on: {
				...$listeners,
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
				{prepend ? <div class={classes.prepend}>{prepend}</div> : null}
				<div class={classes.main}>
					{prefix ? <div class={classes.prefix}>{prefix}</div> : null}
					<input ref="input" type={type} placeholder={placeholder} value={defaultValue} maxLength={maxLength} readonly={readonly} disabled={disabled} {...nativeInputProps} />
					{suffix ? <div class={classes.suffix}>{suffix}</div> : null}
				</div>
				{append ? <div class={classes.append}>{append}</div> : null}
			</div>
		);
	}
};

export default VuiInput;