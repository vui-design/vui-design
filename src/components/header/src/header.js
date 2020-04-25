import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiHeader = {
	name: "vui-header",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		theme: {
			type: String,
			default: "light",
			validator: value => ["light", "dark"].indexOf(value) > -1
		}
	},

	render(h) {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, theme } = this;

		// classes
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "header");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${theme}`]: theme
		};

		// render
		return (
			<div class={classes.el}>{slots.default}</div>
		);
	}
};

export default VuiHeader;