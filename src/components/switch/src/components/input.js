const VuiSwitchInput = {
	name: "vui-switch-input",

	inheritAttrs: false,

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-switch"
		},
		checked: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
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
			if (this.disabled || this.loading) {
				return;
			}

			let checked = e.target.checked;

			this.state.checked = checked;
			this.$emit("change", checked);
		}
	},

	render() {
		let { $attrs, classNamePrefix, disabled, loading, state } = this;
		let { handleFocus, handleBlur, handleChange } = this;
		let classes = `${classNamePrefix}-input`;
		let theInputOptions = {
			attrs: {
				checked: state.checked,
				disabled: disabled || loading,
				...$attrs
			},
			on: {
				focus: handleFocus,
				blur: handleBlur,
				change: handleChange
			}
		};

		return (
			<div class={classes}>
				<input type="checkbox" {...theInputOptions} />
			</div>
		);
	}
};

export default VuiSwitchInput;
