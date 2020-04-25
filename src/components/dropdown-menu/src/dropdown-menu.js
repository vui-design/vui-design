import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

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
		const { $slots: slots, classNamePrefix: customizedClassNamePrefix, theme } = this;
		const classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "dropdown-menu");
		const classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-root`]: true,
			[`${classNamePrefix}-${theme}`]: theme
		};

		return (
			<div class={classes}>{slots.default}</div>
		);
	}
};

export default VuiDropdownMenu;