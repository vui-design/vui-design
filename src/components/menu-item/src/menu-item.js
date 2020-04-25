import VuiIcon from "vui-design/components/icon";
import MixinLink from "vui-design/mixins/link";
import guid from "vui-design/utils/guid";
import guardLinkEvent from "vui-design/utils/guardLinkEvent";

const VuiMenuItem = {
	name: "vui-menu-item",

	inject: {
		vuiMenu: {
			default: undefined
		},
		vuiSubmenu: {
			default: undefined
		}
	},

	components: {
		VuiIcon
	},

	mixins: [
		MixinLink
	],

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-menu-item"
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
		},
		isSelected() {
			return this.name === this.vuiMenu.defaultSelectedName;
		},
		isDisabled() {
			return this.disabled;
		}
	},

	methods: {
		handleClick(e) {
			let { vuiMenu, $router,name, isDisabled, href, to, replace, getNextRoute } = this;

			if (isDisabled) {
				return e.preventDefault();
			}

			vuiMenu.select(name);

			if (href) {

			}
			else if (to && guardLinkEvent(e)) {
				try {
					let next = getNextRoute();

					replace ? $router.replace(next.location).catch(error => {}) : $router.push(next.location).catch(error => {});
				}
				catch(error) {
					console.error(error);
				}
			}
		}
	},

	mounted() {
		this.vuiMenu && this.vuiMenu.addMenuItem(this);
		this.vuiSubmenu && this.vuiSubmenu.addMenuItem(this);
	},

	beforeDestroy() {
		this.vuiMenu && this.vuiMenu.removeMenuItem(this);
		this.vuiSubmenu && this.vuiSubmenu.removeMenuItem(this);
	},

	render(h) {
		let { vuiMenu, $parent, $slots, classNamePrefix, name, indent, isSelected, isDisabled, href, to, target, getNextRoute } = this;
		let { handleClick } = this;

		// Icon
		let icon;

		if ($slots.icon) {
			icon = $slots.icon;
		}
		else if (this.icon) {
			icon = (
				<VuiIcon type={this.icon} />
			);
		}

		// Title
		let title = $slots.default || this.title;

		// Class
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-selected`]: isSelected,
			[`${classNamePrefix}-disabled`]: isDisabled
		};
		classes.elIcon = `${classNamePrefix}-icon`;
		classes.elTitle = `${classNamePrefix}-title`;

		// Style
		let styles = {};

		if (indent > 20) {
			styles.el = {
				paddingLeft: `${indent}px`
			};
		}

		// Render
		let props = {
			attrs: {

			},
			class: classes.el,
			style: styles.el,
			on: {
				click: handleClick
			}
		};
		let children = [];

		if (icon) {
			children.push(
				<div class={classes.elIcon}>{icon}</div>
			);
		}

		if (title) {
			children.push(
				<div class={classes.elTitle}>{title}</div>
			);
		}

		if (href || to) {
			props.attrs.href = href || getNextRoute().href;
			props.attrs.target = target;

			return (
				<a {...props}>{children}</a>
			);
		}
		else {
			return (
				<div {...props}>{children}</div>
			);
		}
	}
};

export default VuiMenuItem;