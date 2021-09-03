import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiDropdownMenu = {
	name: "vui-dropdown-menu",
	inject: {
		vuiDropdown: {
			default: undefined
		}
	},
	provide() {
		return {
			vuiDropdownMenu: this
		};
	},
	props: {
		classNamePrefix: PropTypes.string,
		color: PropTypes.oneOf(["light", "dark"]).def("light")
	},
	render(h) {
		const { $slots: slots, $props: props } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown-menu");
		const classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-root`]: true,
			[`${classNamePrefix}-${props.color}`]: props.color
		};

		// render
		return (
			<div class={classes.el}>{slots.default}</div>
		);
	}
};

export default VuiDropdownMenu;