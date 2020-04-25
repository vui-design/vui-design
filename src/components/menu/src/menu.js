import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiMenu = {
	name: "vui-menu",

	provide() {
		return {
			vuiMenu: this
		};
	},

	model: {
		prop: "selectedName",
		event: "select",
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		mode: {
			type: String,
			default: "horizontal",
			validator: value => ["horizontal", "vertical", "inline"].indexOf(value) > -1
		},
		theme: {
			type: String,
			default: "light",
			validator: value => ["light", "dark"].indexOf(value) > -1
		},
		collapsed: {
			type: Boolean,
			default: false
		},
		openNames: {
			type: Array,
			default: () => []
		},
		selectedName: {
			type: String,
			default: undefined
		}
	},

	data() {
		return {
			defaultOpenNames: this.mode === "inline" && !this.collapsed ? this.openNames : [],
			defaultSelectedName: this.selectedName,
			mapSubmenus: {},
			mapMenuItems: {}
		};
	},

	watch: {
		mode(value) {
			if (value === "inline" && !this.collapsed) {

			}
			else {
				this.defaultOpenNames = [];
			}
		},
		collapsed(value) {
			if (this.mode === "inline" && !value) {

			}
			else {
				this.defaultOpenNames = [];
			}
		},
		openNames(value) {
			if (this.mode === "inline" && !this.collapsed) {
				this.defaultOpenNames = value;
			}
			else {
				this.defaultOpenNames = [];
			}
		},
		selectedName(value) {
			this.defaultSelectedName = value;
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

		open(name) {
			let index = this.defaultOpenNames.indexOf(name);

			if (index > -1) {
				return;
			}

			this.defaultOpenNames.push(name);
			this.$emit("open", name);
			this.$emit("toggle", this.defaultOpenNames);
		},
		close(name) {
			let index = this.defaultOpenNames.indexOf(name);

			if (index === -1) {
				return;
			}

			this.defaultOpenNames.splice(index, 1);
			this.$emit("close", name);
			this.$emit("toggle", this.defaultOpenNames);
		},
		select(name) {
			if (this.mode === "horizontal" || this.mode === "vertical" || (this.mode === "inline" && this.collapsed)) {
				this.defaultOpenNames = [];
			}

			this.defaultSelectedName = name;
			this.$emit("select", name);
		}
	},

	render(h) {
		const { $slots: slots, classNamePrefix: customizedClassNamePrefix, mode, theme, collapsed } = this;

		// Direction
		const direction = mode === "horizontal" ? "horizontal" : "vertical";

		// Class
		const classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "menu");
		const classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-root`]: true,
			[`${classNamePrefix}-${direction}`]: direction,
			[`${classNamePrefix}-${theme}`]: theme,
			[`${classNamePrefix}-collapsed`]: mode === "inline" && collapsed
		};

		// Render
		return (
			<div class={classes}>{slots.default}</div>
		);
	}
};

export default VuiMenu;