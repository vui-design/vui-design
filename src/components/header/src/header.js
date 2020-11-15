import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiHeader = {
	name: "vui-header",
	props: {
		classNamePrefix: PropTypes.string,
		theme: PropTypes.oneOf(["light", "dark"]).def("light")
	},
	render(h) {
		const { $slots: slots, $props: props } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "layout-header");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.theme}`]: props.theme
		};

		// render
		return (
			<div class={classes.el}>{slots.default}</div>
		);
	}
};

export default VuiHeader;