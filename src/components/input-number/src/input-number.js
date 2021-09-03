import VuiIcon from "../../icon";
import Emitter from "../../../mixins/emitter";
import Longpress from "../../../directives/longpress";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getNumberPrecision from "../../../utils/getNumberPrecision";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

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
		classNamePrefix: PropTypes.string,
		placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		value: PropTypes.number,
		min: PropTypes.number.def(-Infinity),
		max: PropTypes.number.def(Infinity),
		step: PropTypes.number.def(1),
		precision: PropTypes.number,
		formatter: PropTypes.func,
		parser: PropTypes.func,
		size: PropTypes.oneOf(["small", "medium", "large"]),
		readonly: PropTypes.bool.def(false),
		disabled: PropTypes.bool.def(false),
		validator: PropTypes.bool.def(true)
	},
	data() {
		const { $props: props } = this;
		const state = {
			hovered: false,
			focused: false,
			value: this.getStateValueFromProps(props)
		};

		return {
			state
		};
	},
	watch: {
		value() {
			const { $props: props } = this;

			this.setStateValueFromProps(props);
		},
		min() {
			const { $props: props } = this;

			this.setStateValueFromProps(props);
		},
		max() {
			const { $props: props } = this;

			this.setStateValueFromProps(props);
		},
		precision() {
			const { $props: props } = this;

			this.setStateValueFromProps(props);
		}
	},
	methods: {
		focus() {
			this.$refs.input.focus();
		},
		blur() {
			this.$refs.input.blur();
		},
		getStateValueFromProps(props) {
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
		setStateValueFromProps(props) {
			const { state } = this;
			const value = this.getStateValueFromProps(props);

			if (state.value === value) {
				return;
			}

			this.setStateValue(value);
		},
		getPrecision() {
			const { $props: props } = this;
			const map = {
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
			const { $props: props } = this;

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

			const factor = Math.pow(10, this.getPrecision());

			return this.setPrecision((factor * value + factor * step) / factor);
		},
		decrease(value, step) {
			value = value || 0;

			if (!is.number(value)) {
				return this.state.value;
			}

			const factor = Math.pow(10, this.getPrecision());

			return this.setPrecision((factor * value - factor * step) / factor);
		},
		handleMouseenter(e) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.state.hovered = true;
			this.$emit("mouseenter", e);
		},
		handleMouseleave(e) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.state.hovered = false;
			this.$emit("mouseleave", e);
		},
		handleFocus(e) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.state.focused = true;
			this.$emit("focus", e);
		},
		handleBlur(e) {
			const { $props: props, state } = this;

			if (props.disabled) {
				return;
			}

			this.state.focused = false;
			this.$emit("blur", e);

			if (props.validator) {
				this.dispatch("vui-form-item", "blur", state.value);
			}
		},
		handleKeydown(e) {
			const { $props: props } = this;
			const keyCode = e.keyCode;

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
			const { $props: props, state } = this;
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
			const { $props: props, state } = this;
			const value = this.increase(state.value, props.step);
			const disabledBtnIncrease = value > props.max;

			if (!state.focused) {
				this.focus();
			}

			if (disabledBtnIncrease) {
				return;
			}

			this.setStateValue(value);
		},
		handleDecrease() {
			const { state, $props: props } = this;
			const value = this.decrease(state.value, props.step);
			const disabledBtnDecrease = value < props.min;

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
		const { $vui: vui, vuiForm, vuiInputGroup, $listeners: listeners, $attrs: attrs, $props: props, state } = this;
		const { handleMouseenter, handleMouseleave, handleFocus, handleBlur, handleKeydown, handleKeyup, handleInput, handleChange, handleIncrease, handleDecrease, handleIncreaseMousedown, handleDecreaseMousedown } = this;

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

		// disabled increase button
		const disabledBtnIncrease = this.increase(state.value, props.step) > props.max;

		// disabled decrease button
		const disabledBtnDecrease = this.decrease(state.value, props.step) < props.min;

		// value
		let value = state.value;

		if (is.number(value) && is.number(props.precision)) {
			value = value.toFixed(props.precision);
		}

		if (is.number(value) && is.function(props.formatter)) {
			value = props.formatter(value);
		}

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "input-number");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${size}`]: size,
			[`${classNamePrefix}-hovered`]: state.hovered,
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
		const elInputProps = {
			ref: "input",
			attrs: {
				...attrs,
				type: "text",
				autocomplete: "off",
				spellcheck: false,
				placeholder: props.placeholder,
				readonly: props.readonly,
				disabled: disabled,
				class: classes.elInput
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
			<div class={classes.el} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave}>
				<input {...elInputProps} value={value} />
				{
					!props.readonly && !disabled && (
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