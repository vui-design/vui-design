import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiDropdownMenuItemGroup = {
	name: "vui-dropdown-menu-item-group",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		title: {
			type: String,
			default: undefined
		}
	},

	render(h) {
		const { vuiMenu, $slots: slots, classNamePrefix: customizedClassNamePrefix, title, indent } = this;
		const classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "dropdown-menu-item-group");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elHeader = `${classNamePrefix}-header`;
		classes.elBody = `${classNamePrefix}-body`;

		return (
			<div class={classes.el}>
				<div class={classes.elHeader}>{slots.title || title}</div>
				<div class={classes.elBody}>{slots.default}</div>
			</div>
		);
	}
};

export default VuiDropdownMenuItemGroup;