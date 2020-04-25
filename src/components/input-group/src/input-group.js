import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiInputGroup = {
	name: "vui-input-group",

	provide() {
		return {
			vuiInputGroup: this
		};
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		compact: {
			type: Boolean,
			default: false
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
		const { $slots: slots, classNamePrefix: customizedClassNamePrefix, compact } = this;
		const classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "input-group");
		const classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-compact`]: compact
		};

		return (
			<div class={classes}>{slots.default}</div>
		);
	}
};

export default VuiInputGroup;