import VuiIcon from "vui-design/components/icon";
import Emitter from "vui-design/mixins/emitter";
import Longpress from "vui-design/directives/longpress";
import is from "vui-design/utils/is";
import getNumberPrecision from "vui-design/utils/getNumberPrecision";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const regexp = {
	numeric: /^[\+\-]?\d*?\.?\d*?$/,
	endWithDecimalPoint: /^[\+\-]?\d*?\.$/
};

const VuiInputNumber = {
	name: "vui-input-number",

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

	directives: {
		Longpress
	},

	inheritAttrs: false,

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		placeholder: {
			type: String,
			default: undefined
		},
		value: {
			type: Number,
			default: undefined
		},
		min: {
			type: Number,
			default: -Infinity
		},
		max: {
			type: Number,
			default: Infinity
		},
		step: {
			type: Number,
			default: 1
		},
		precision: {
			type: Number,
			default: undefined,
			validator: value => value >= 0
		},
		formatter: {
			type: Function,
			default: undefined
		},
		parser: {
			type: Function,
			default: undefined
		},
		size: {
			type: String,
			default: undefined,
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
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
			default: false
		}
	},

	data() {
		let { $props: props } = this;
		let value = this.getDerivedValueFromProps(props);

		return {
			state: {
				focused: false,
				value
			}
		};
	},

	watch: {
		value() {
			let { state, $props: props } = this;
			let value = this.getDerivedValueFromProps(props);

			if (state.value === value) {
				return;
			}

			this.setStateValue(value);
		},
		min() {
			let { state, $props: props } = this;
			let value = this.getDerivedValueFromProps(props);

			if (state.value === value) {
				return;
			}

			this.setStateValue(value);
		},
		max() {
			let { state, $props: props } = this;
			let value = this.getDerivedValueFromProps(props);

			if (state.value === value) {
				return;
			}

			this.setStateValue(value);
		},
		precision() {
			let { state, $props: props } = this;
			let value = this.getDerivedValueFromProps(props);

			if (state.value === value) {
				return;
			}

			this.setStateValue(value);
		}
	},

	methods: {
		focus() {
			this.$refs.input.focus();
		},
		blur() {
			this.$refs.input.blur();
		},

		getDerivedValueFromProps(props) {
			let value;

			if (is.number(props.value)) {
				value = props.value;
			}
			else if (is.string(props.value)) {
				value = props.value.trim();
				value = value.length ? Number(value) : undefined;
				value = is.number(value) ? value : undefined;
			}

			return this.getStateValue(value);
		},

		getPrecision() {
			let { $props: props } = this;
			let map = {
				value: getNumberPrecision(props.value),
				step: getNumberPrecision(props.step)
			};

			if (!is.number(props.precision)) {
				return Math.max(map.value, map.step);
			}

			if (map.step > props.precision) {
				console.warn("[Vui warn][VuiInputNumber]: the \"precision\" should not be less than the decimal places of \"step\"!");
			}

			return props.precision;
		},
		setPrecision(value, precision) {
			if (!is.number(precision)) {
				precision = this.getPrecision();
			}

			return parseFloat(Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision));
		},

		getStateValue(value) {
			let { $props: props } = this;

			if (is.number(value) && is.number(props.precision)) {
				value = this.setPrecision(value, props.precision);
			}

			if (value < props.min) {
				value = props.min;
			}

			if (value > props.max) {
				value = props.max;
			}

			return value;
		},
		setStateValue(value) {
			this.state.value = value;
			this.$emit("input", value);
			this.$emit("change", value);

			if (this.validator) {
				this.dispatch("vui-form-item", "change", value);
			}
		},

		increase(value, step) {
			value = value || 0;

			if (!is.number(value)) {
				return this.state.value;
			}

			let factor = Math.pow(10, this.getPrecision());

			return this.setPrecision((factor * value + factor * step) / factor);
		},
		decrease(value, step) {
			value = value || 0;

			if (!is.number(value)) {
				return this.state.value;
			}

			let factor = Math.pow(10, this.getPrecision());

			return this.setPrecision((factor * value - factor * step) / factor);
		},

		handleFocus(e) {
			this.state.focused = true;
			this.$emit("focus", e);
		},
		handleBlur(e) {
			this.state.focused = false;
			this.$emit("blur", e);

			if (this.validator) {
				this.dispatch("vui-form-item", "blur", this.state.value);
			}
		},
		handleKeydown(e) {
			let { $props: props } = this;
			let keyCode = e.keyCode;

			if (keyCode === 38) {
				e.preventDefault();
				this.handleIncrease();
			}
			else if (keyCode === 40) {
				e.preventDefault();
				this.handleDecrease();
			}
			else if (keyCode === 8) {
				let value = e.target.value;

				if (is.function(props.parser)) {
					value = props.parser(value);
				}

				this.$refs.input.value = value;
			}

			this.$emit("keydown", e);
		},
		handleKeyup(e) {
			this.$emit("keyup", e);
		},
		handleInput(e) {
			let { state, $props: props } = this;
			let value = e.target.value;

			if (is.function(props.parser)) {
				value = props.parser(value);
			}

			if (is.string(value)) {
				value = value.trim();
			}

			// When the input string is empty, clear the value
			if (value.length === 0){
				this.setStateValue(undefined);
			}
			// When the input string matches the numeric type, do the following
			else if (regexp.numeric.test(value)) {
				let number = Number(value);

				if (is.nan(number) || regexp.endWithDecimalPoint.test(value)) {
					if (is.function(props.formatter)) {
						value = props.formatter(value);
					}

					this.$refs.input.value = value;
				}
				else {
					number = this.getStateValue(number);

					if (state.value === number) {
						value = state.value;

						if (is.number(value) && is.number(props.precision)) {
							value = value.toFixed(props.precision);
						}

						if (is.number(value) && is.function(props.formatter)) {
							value = props.formatter(value);
						}

						this.$refs.input.value = is.number(value) || is.string(value) ? value : "";
					}
					else {
						this.setStateValue(number);
					}
				}
			}
			// In other cases, return to the previous value
			else {
				value = state.value;

				if (is.number(value) && is.number(props.precision)) {
					value = value.toFixed(props.precision);
				}

				if (is.number(value) && is.function(props.formatter)) {
					value = props.formatter(value);
				}

				this.$refs.input.value = is.number(value) || is.string(value) ? value : "";
			}
		},
		handleChange(e) {
			this.handleInput(e);
		},
		handleIncrease() {
			let { state, $props: props } = this;
			let value = this.increase(state.value, props.step);
			let disabledBtnIncrease = value > props.max;

			if (!state.focused) {
				this.focus();
			}

			if (disabledBtnIncrease) {
				return;
			}

			this.setStateValue(value);
		},
		handleDecrease() {
			let { state, $props: props } = this;
			let value = this.decrease(state.value, props.step);
			let disabledBtnDecrease = value < props.min;

			if (!state.focused) {
				this.focus();
			}

			if (disabledBtnDecrease) {
				return;
			}

			this.setStateValue(value);
		},
		handleIncreaseMousedown(e) {
			e.preventDefault();
		},
		handleDecreaseMousedown(e) {
			e.preventDefault();
		}
	},

	render(h) {
		let { $vui: vui, vuiForm, vuiInputGroup } = this;
		let { state, $props: props, $attrs: attrs, $listeners: listeners } = this;
		let { handleFocus, handleBlur, handleKeydown, handleKeyup, handleInput, handleChange, handleIncrease, handleDecrease, handleIncreaseMousedown, handleDecreaseMousedown } = this;

		// size: self > vuiInputGroup > vuiForm > vui
		let size;

		if (props.size) {
			size = props.size;
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

		// readonly: vuiForm > vuiInputGroup > self
		let readonly;

		if (vuiForm && vuiForm.readonly) {
			readonly = vuiForm.readonly;
		}
		else if (vuiInputGroup && vuiInputGroup.readonly) {
			readonly = vuiInputGroup.readonly;
		}
		else {
			readonly = props.readonly;
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
			disabled = props.disabled;
		}

		// 
		let disabledBtnIncrease = this.increase(state.value, props.step) > props.max;

		// 
		let disabledBtnDecrease = this.decrease(state.value, props.step) < props.min;

		// value
		let value = state.value;

		if (is.number(value) && is.number(props.precision)) {
			value = value.toFixed(props.precision);
		}

		if (is.number(value) && is.function(props.formatter)) {
			value = props.formatter(value);
		}

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "input-number");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${size}`]: size,
			[`${classNamePrefix}-focused`]: state.focused,
			[`${classNamePrefix}-disabled`]: disabled
		};
		classes.elInput = `${classNamePrefix}-input`;
		classes.elTrigger = `${classNamePrefix}-trigger`;
		classes.elBtnIncrease = {
			[`${classNamePrefix}-btn`]: true,
			[`${classNamePrefix}-btn-increase`]: true,
			[`${classNamePrefix}-btn-disabled`]: disabledBtnIncrease
		};
		classes.elBtnDecrease = {
			[`${classNamePrefix}-btn`]: true,
			[`${classNamePrefix}-btn-decrease`]: true,
			[`${classNamePrefix}-btn-disabled`]: disabledBtnDecrease
		};

		// render
		let attributes = {
			attrs: {
				...attrs
			},
			on: {
				...listeners,
				focus: handleFocus,
				blur: handleBlur,
				keydown: handleKeydown,
				keyup: handleKeyup,
				input: handleInput,
				change: handleChange
			}
		};

		return (
			<div class={classes.el}>
				<input ref="input" type="text" autocomplete="off" spellcheck="false" {...attributes} class={classes.elInput} placeholder={props.placeholder} value={value} readonly={readonly} disabled={disabled} />
				{
					!readonly && !disabled && (
						<div class={classes.elTrigger}>
							<div class={classes.elBtnIncrease} v-longpress={handleIncrease} onMousedown={handleIncreaseMousedown}>
								<VuiIcon type="chevron-up" />
							</div>
							<div class={classes.elBtnDecrease} v-longpress={handleDecrease} onMousedown={handleDecreaseMousedown}>
								<VuiIcon type="chevron-down" />
							</div>
						</div>
					)
				}
			</div>
		);
	}
};

export default VuiInputNumber;