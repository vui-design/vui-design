import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

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
			default: undefined
		},
		type: {
			type: String,
			default: "default",
			validator: value => ["default", "primary", "info", "warning", "success", "error", "dashed"].indexOf(value) > -1
		},
		shape: {
			type: String,
			default: undefined,
			validator: value => ["round"].indexOf(value) > -1
		},
		size: {
			type: String,
			default: undefined,
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	render() {
		let { $slots: slots, $props: props } = this;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "button-group");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		// render
		return (
			<div class={classes.el}>
				{slots.default}
			</div>
		);
	}
};

export default VuiButtonGroup;