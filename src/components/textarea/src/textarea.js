import VuiIcon from "vui-design/components/icon";
import Emitter from "vui-design/mixins/emitter";
import is from "vui-design/utils/is";
import merge from "vui-design/utils/merge";
import css from "vui-design/utils/css";
import getTextareaSize from "vui-design/utils/getTextareaSize";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiTextarea = {
	name: "vui-textarea",

	inject: {
		vuiForm: {
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
		rows: {
			type: [String, Number],
			default: 4
		},
		autosize: {
			type: [Boolean, Object],
			default: false
		},
		resize: {
			type: Boolean,
			default: false
		},
		clearable: {
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
			defaultValue: this.value
		};
	},

	watch: {
		value(value) {
			if (this.defaultValue === value) {
				return;
			}

			this.defaultValue = value;
			this.resizeTextarea();

			if (this.validator) {
				this.dispatch("vui-form-item", "change", this.defaultValue);
			}
		}
	},

	methods: {
		focus() {
			this.$refs.textarea.focus();
		},
		blur() {
			this.$refs.textarea.blur();
		},

		resizeTextarea() {
			if (is.server) {
				return;
			}

			this.$nextTick(() => {
				let styles = null;

				if (!this.autosize) {
					styles = {
						minHeight: getTextareaSize(this.$refs.textarea).minHeight
					};
				}
				else {
					let { minRows, maxRows } = this.autosize;

					styles = getTextareaSize(this.$refs.textarea, minRows, maxRows);
				}

				css(this.$refs.textarea, merge(styles, {
					resize: this.resize ? "vertical" : "none"
				}));
			});
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
			this.dispatch("vui-form-item", "blur", this.defaultValue);
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
			this.resizeTextarea();
			this.$emit("input", this.defaultValue);
			this.dispatch("vui-form-item", "change", this.defaultValue);
		},
		handleClear(e) {
			this.defaultValue = "";
			this.focus();
			this.resizeTextarea();
			this.$emit("clear", e);
			this.$emit("input", this.defaultValue);
			this.$emit("change", e);
			this.dispatch("vui-form-item", "change", this.defaultValue);
		}
	},

	mounted() {
		this.resizeTextarea();
	},

	render(h) {
		let { $vui: vui, vuiForm, $attrs: attrs, $listeners: listeners, classNamePrefix: customizedClassNamePrefix, placeholder, defaultValue, maxLength, rows, autosize, clearable, readonly } = this;
		let { handleMouseenter, handleMouseleave, handleFocus, handleBlur, handleKeydown, handleKeyup, handleChange, handleInput, handleClear } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "textarea");

		// disabled: vuiForm > self
		let disabled;

		if (vuiForm && vuiForm.disabled) {
			disabled = vuiForm.disabled;
		}
		else {
			disabled = this.disabled;
		}

		// classes
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-disabled`]: disabled
		};
		classes.elMain = `${classNamePrefix}-main`;
		classes.elMainBtnClear = `${classNamePrefix}-main-btn-clear`;
		classes.elMainStatistic = `${classNamePrefix}-main-statistic`;

		// render
		let nativeTextareaProps = {
			ref: "textarea",
			attrs: {
				...attrs,
				placeholder,
				maxLength,
				rows,
				readonly,
				disabled
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

		let btnClear;

		if (clearable && !readonly && !disabled && defaultValue !== "") {
			let btnClearProps = {
				props: {
					type: "crossmark-circle-filled"
				},
				class: classes.elMainBtnClear,
				on: {
					mousedown: e => e.preventDefault(),
					click: handleClear
				}
			};

			btnClear = (
				<VuiIcon {...btnClearProps} />
			);
		}

		let statistic;

		if (maxLength) {
			let length = 0;

			if (is.string(defaultValue)) {
				length = defaultValue.length;
			}
			else if (is.number(defaultValue)) {
				length = String(defaultValue).length;
			}

			statistic = (
				<label class={classes.elMainStatistic}>{`${length}/${maxLength}`}</label>
			);
		}

		return (
			<div class={classes.el}>
				<div class={classes.elMain}>
					<textarea {...nativeTextareaProps} value={defaultValue} />
					{btnClear}
					{statistic}
				</div>
			</div>
		);
	}
};

export default VuiTextarea;