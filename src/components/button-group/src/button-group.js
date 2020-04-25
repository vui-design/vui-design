const VuiButtonGroup = {
	name: "vui-button-group",

	provide() {
		return {
			vuiButtonGroup: this
		};
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-button-group"
		},
		type: {
			type: String,
			default: "default",
			validator(value) {
				return ["default", "primary", "info", "warning", "success", "error", "dashed"].indexOf(value) > -1;
			}
		},
		shape: {
			type: String,
			default: undefined,
			validator(value) {
				return ["round"].indexOf(value) > -1;
			}
		},
		size: {
			type: String,
			default: undefined,
			validator(value) {
				return ["small", "medium", "large"].indexOf(value) > -1;
			}
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	render() {
		let { $slots, classNamePrefix } = this;

		return (
			<div class={`${classNamePrefix}`}>
				{$slots.default}
			</div>
		);
	}
};

export default VuiButtonGroup;