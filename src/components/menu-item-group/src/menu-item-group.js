import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiMenuItemGroup = {
	name: "vui-menu-item-group",

	inject: {
		vuiMenu: {
			default: undefined
		}
	},

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

	computed: {
		indent() {
			let isInline = this.vuiMenu.mode === "inline" && !this.vuiMenu.collapsed;
			let indent = 20;
			let parent = this.$parent;
			let parentName = parent.$options.name;

			if (isInline) {
				while (parentName !== "vui-menu") {
					indent = parentName === "vui-submenu" ? (indent + 24) : indent;
					parent = parent.$parent;
					parentName = parent.$options.name;
				}
			}

			return indent;
		}
	},

	render(h) {
		let { vuiMenu, $slots: slots, classNamePrefix: customizedClassNamePrefix, title, indent } = this;

		// Class
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "menu-item-group");

		// Style
		let headerStyle = {};

		if (indent > 20) {
			headerStyle.paddingLeft = `${indent}px`;
		}

		// Render
		return (
			<div class={`${classNamePrefix}`}>
				<div class={`${classNamePrefix}-header`} style={headerStyle}>{slots.title || title}</div>
				<div class={`${classNamePrefix}-body`}>{slots.default}</div>
			</div>
		);
	}
};

export default VuiMenuItemGroup;