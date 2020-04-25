const VuiCheckboxInput = {
	name: "vui-checkbox-input",

	inheritAttrs: false,

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
		name: {
			type: String,
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
					<path d="M0.020966 0l1023.958044 0 0 1024-1023.958044 0 0-1024Z"></path>
				</svg>
			);

			children.push(
				<svg viewBox="0 0 1248 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
					<path d="M123.800257 460.153135l291.677674 232.393077 726.28329-669.078427s48.722384-44.483585 91.293444-9.727389c12.638284 10.392563 27.272086 39.993364-5.653359 86.388252L469.106727 988.380911s-58.120238 79.570536-127.131004-0.831161L14.711914 545.710226s-38.829006-59.865554 9.72861-95.701892c16.463333-11.973111 53.713011-30.763938 99.360954 10.14358z"></path>
				</svg>
			);
		}

		children.push(
			<input type="checkbox" name={name} checked={state.checked} disabled={disabled} value={value} {...theInputOptions} />
		);

		return (
			<div class={classes}>
				{children}
			</div>
		);
	}
};

export default VuiCheckboxInput;
