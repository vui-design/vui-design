import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiDropdownMenuItemGroup = {
	name: "vui-dropdown-menu-item-group",
	props: {
		classNamePrefix: PropTypes.string,
		title: PropTypes.string
	},
	render(h) {
		const { $slots: slots, $props: props } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown-menu-item-group");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elHeader = `${classNamePrefix}-header`;
		classes.elBody = `${classNamePrefix}-body`;

		// render
		return (
			<div class={classes.el}>
				<div class={classes.elHeader}>{slots.title || props.title}</div>
				<div class={classes.elBody}>{slots.default}</div>
			</div>
		);
	}
};

export default VuiDropdownMenuItemGroup;