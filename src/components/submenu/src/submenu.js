import VuiIcon from "vui-design/components/icon";
import VuiSubmenuInline from "./submenu-inline";
import VuiSubmenuPopup from "./submenu-popup";
import guid from "vui-design/utils/guid";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiSubmenu = {
	name: "vui-submenu",

	provide() {
		return {
			vuiSubmenu: this
		};
	},

	inject: {
		vuiMenu: {
			default: undefined
		},
		vuiSubmenu: {
			default: undefined
		}
	},

	components: {
		VuiIcon,
		VuiSubmenuInline,
		VuiSubmenuPopup
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		name: {
			type: [String, Number],
			default: () => guid()
		},
		icon: {
			type: String,
			default: undefined
		},
		title: {
			type: String,
			default: undefined
		},
		disabled: {
			type: Boolean,
			default: false
		},
		animations: {
			type: Array,
			default: () => ["vui-submenu-body-collapse", "vui-submenu-body-zoom-top", "vui-submenu-body-zoom-left"]
		},
		getPopupContainer: {
			type: Function,
			default: () => document.body
		}
	},

	data() {
		return {
			mapSubmenus: {},
			mapMenuItems: {}
		};
	},

	computed: {
		level() {
			let level = 1;
			let parent = this.$parent;
			let parentName = parent.$options.name;

			while (parentName !== "vui-menu") {
				level = parentName === "vui-submenu" ? (level + 1) : level;
				parent = parent.$parent;
				parentName = parent.$options.name;
			}

			return level;
		},
		indent() {
			let isInline = this.isInline;
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
		},
		isInline() {
			let vuiMenu = this.vuiMenu;

			return vuiMenu.mode === "inline" && !vuiMenu.collapsed;
		},
		isPopup() {
			let vuiMenu = this.vuiMenu;

			return vuiMenu.mode === "horizontal" || vuiMenu.mode === "vertical" || (vuiMenu.mode === "inline" && vuiMenu.collapsed);
		},
		isOpen() {
			let vuiMenu = this.vuiMenu;
			let name = this.name;

			return vuiMenu.defaultOpenNames.indexOf(name) > -1;
		},
		isSelected() {
			let mapSubmenus = this.mapSubmenus;
			let mapMenuItems = this.mapMenuItems;
			let isSelected = false;

			Object.keys(mapSubmenus).forEach(name => {
				let submenu = mapSubmenus[name];

				if (submenu && submenu.isSelected) {
					isSelected = true;
				}
			});

			Object.keys(mapMenuItems).forEach(name => {
				let menuItem = mapMenuItems[name];

				if (menuItem && menuItem.isSelected) {
					isSelected = true;
				}
			});

			return isSelected;
		},
		isDisabled() {
			return this.disabled;
		}
	},

	methods: {
		addSubmenu(submenu) {
			this.$set(this.mapSubmenus, submenu.name, submenu);
		},
		removeSubmenu(submenu) {
			this.$delete(this.mapSubmenus, submenu.name);
		},
		addMenuItem(menuItem) {
			this.$set(this.mapMenuItems, menuItem.name, menuItem);
		},
		removeMenuItem(menuItem) {
			this.$delete(this.mapMenuItems, menuItem.name);
		},

		handleInlineToggle(value) {
			if (this.isDisabled) {
				return;
			}

			if (value) {
				this.vuiMenu.open(this.name);
			}
			else {
				this.vuiMenu.close(this.name);
			}
		},
		handlePopupToggle(value, forceParentSubmenu) {
			if (this.isDisabled) {
				return;
			}

			if (value) {
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => this.vuiMenu.open(this.name), 200);

				if (!forceParentSubmenu) {
					return;
				}

				let parent = this.$parent;
				let parentName = parent ? parent.$options.name : undefined;

				while (parent && parentName !== "vui-submenu") {
					parent = parent.$parent;
					parentName = parent ? parent.$options.name : undefined;
				}

				if (parent) {
					parent.handlePopupToggle(value, forceParentSubmenu);
				}
			}
			else {
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => this.vuiMenu.close(this.name), 200);

				if (!forceParentSubmenu) {
					return;
				}

				let parent = this.$parent;
				let parentName = parent ? parent.$options.name : undefined;

				while (parent && parentName !== "vui-submenu") {
					parent = parent.$parent;
					parentName = parent ? parent.$options.name : undefined;
				}

				if (parent) {
					parent.handlePopupToggle(value, forceParentSubmenu);
				}
			}
		}
	},

	mounted() {
		this.vuiMenu && this.vuiMenu.addSubmenu(this);
		this.vuiSubmenu && this.vuiSubmenu.addSubmenu(this);
	},

	beforeDestroy() {
		this.vuiMenu && this.vuiMenu.removeSubmenu(this);
		this.vuiSubmenu && this.vuiSubmenu.removeSubmenu(this);
	},

	render(h) {
		const { vuiMenu, $slots: slots, classNamePrefix: customizedClassNamePrefix, level, indent, isInline, isPopup, isOpen, isSelected, isDisabled, animations, getPopupContainer } = this;
		const { handleInlineToggle, handlePopupToggle } = this;

		// Icon
		let icon;

		if (slots.icon) {
			icon = slots.icon;
		}
		else if (this.icon) {
			icon = (
				<VuiIcon type={this.icon} />
			);
		}

		// Title
		let title = slots.title || this.title;

		// Class
		const menuClassNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "menu");
		const classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "submenu");

		// Render
		if (isInline) {
			const animation = animations[0];

			return (
				<VuiSubmenuInline
					classNamePrefix={classNamePrefix}
					mode={vuiMenu.mode}
					theme={vuiMenu.theme}
					level={level}
					indent={indent}
					open={isOpen}
					selected={isSelected}
					disabled={isDisabled}
					animation={animation}
					onToggle={handleInlineToggle}
				>
					{icon && <template slot="icon">{icon}</template>}
					{title && <template slot="title">{title}</template>}
					<div class={[`${menuClassNamePrefix}`, `${menuClassNamePrefix}-inline`, `${menuClassNamePrefix}-vertical`, `${menuClassNamePrefix}-${vuiMenu.theme}`]}>{slots.default}</div>
				</VuiSubmenuInline>
			);
		}
		else if (isPopup) {
			const animation = vuiMenu.mode === "horizontal" ? animations[1] : animations[2];

			return (
				<VuiSubmenuPopup
					classNamePrefix={classNamePrefix}
					mode={vuiMenu.mode}
					theme={vuiMenu.theme}
					level={level}
					indent={indent}
					open={isOpen}
					selected={isSelected}
					disabled={isDisabled}
					animation={animation}
					getPopupContainer={getPopupContainer}
					onToggle={handlePopupToggle}
				>
					{icon && <template slot="icon">{icon}</template>}
					{title && <template slot="title">{title}</template>}
					<div class={[`${menuClassNamePrefix}`, `${menuClassNamePrefix}-popup`, `${menuClassNamePrefix}-vertical`, `${menuClassNamePrefix}-${vuiMenu.theme}`]}>{slots.default}</div>
				</VuiSubmenuPopup>
			);
		}
	}
};

export default VuiSubmenu;