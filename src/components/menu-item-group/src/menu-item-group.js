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
			default: "vui-menu-item-group"
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
		let { vuiMenu, $slots, classNamePrefix, title, indent } = this;
		let headerStyles = {};

		if (indent > 20) {
			headerStyles.paddingLeft = `${indent}px`;
		}

		return (
			<div class={`${classNamePrefix}`}>
				<div class={`${classNamePrefix}-header`} style={headerStyles}>{$slots.title || title}</div>
				<div class={`${classNamePrefix}-body`}>{$slots.default}</div>
			</div>
		);
	}
};

export default VuiMenuItemGroup;