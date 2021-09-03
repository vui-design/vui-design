import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const colors = ["light", "dark"];

const VuiMenu = {
	name: "vui-menu",
	provide() {
		return {
			vuiMenu: this
		};
	},
	model: {
		prop: "selectedName",
		event: "select"
	},
	props: {
		classNamePrefix: PropTypes.string,
		mode: PropTypes.oneOf(["horizontal", "vertical", "inline"]).def("horizontal"),
		theme: PropTypes.string,
		color: PropTypes.string.def("light"),
		collapsed: PropTypes.bool.def(false),
		openNames: PropTypes.array.def([]),
		selectedName: PropTypes.string
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
		const { $slots: slots, classNamePrefix: customizedClassNamePrefix, mode, collapsed } = this;

		// direction
		const direction = mode === "horizontal" ? "horizontal" : "vertical";

		// color
		const color = this.theme || this.color;
		const withPresetColor = color && colors.indexOf(color) > -1;
		const withCustomColor = color && colors.indexOf(color) === -1;

		// Class
		const classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "menu");
		const classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-root`]: true,
			[`${classNamePrefix}-${direction}`]: direction,
			[`${classNamePrefix}-${color}`]: withPresetColor,
			[`${classNamePrefix}-collapsed`]: mode === "inline" && collapsed
		};

		// style
		let styles = {};

		if (withCustomColor) {
			styles.el = {
				backgroundColor: color
			};
		}

		// Render
		return (
			<div class={classes} style={styles.el}>{slots.default}</div>
		);
	}
};

export default VuiMenu;