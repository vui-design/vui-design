const VuiRadioInput = {
	name: "vui-radio-input",

	inheritAttrs: false,

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
		name: {
			type: String,
			default: undefined
		},
		checked: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		value: {
			type: [String, Number],
			default: undefined
		}
	},

	data() {
		return {
			state: {
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
			this.$emit("focus");
		},
		handleBlur(e) {
			this.$emit("blur");
		},
		handleChange(e) {
			if (this.disabled) {
				return;
			}

			let data = {
				checked: e.target.checked,
				value: this.value
			};

			this.state.checked = data.checked;
			this.$emit("change", data);
		}
	},

	render() {
		let { $attrs, classNamePrefix, type, name, value, disabled, state } = this;
		let { handleFocus, handleBlur, handleChange } = this;
		let classes = `${classNamePrefix}-input`;
		let theInputOptions = {
			attrs: $attrs,
			on: {
				focus: handleFocus,
				blur: handleBlur,
				change: handleChange
			}
		};
		let children = [];

		if (!type) {
			children.push(
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
					<path d="M512 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z"></path>
				</svg>
			);
		}

		children.push(
			<input type="radio" name={name} checked={state.checked} disabled={disabled} value={value} {...theInputOptions} />
		);

		return (
			<div class={classes}>
				{children}
			</div>
		);
	}
};

export default VuiRadioInput;
