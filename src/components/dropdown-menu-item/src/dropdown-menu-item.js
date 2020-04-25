import VuiIcon from "vui-design/components/icon";
import MixinLink from "vui-design/mixins/link";
import guid from "vui-design/utils/guid";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import guardLinkEvent from "vui-design/utils/guardLinkEvent";

const VuiDropdownMenuItem = {
	name: "vui-dropdown-menu-item",

	inject: {
		vuiDropdown: {
			default: undefined
		},
		vuiDropdownMenu: {
			default: undefined
		},
		vuiDropdownSubmenu: {
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
		}
	},

	methods: {
		handleClick(e) {
			const { vuiDropdown, vuiDropdownMenu, vuiDropdownSubmenu, $router: router, name, disabled, href, to, replace, getNextRoute } = this;

			if (disabled) {
				return e.preventDefault();
			}

			vuiDropdownMenu.$emit("click", name);

			if (vuiDropdownSubmenu) {
				vuiDropdownSubmenu.close("select", true);
			}
			else if (vuiDropdown) {
				vuiDropdown.close("select");
			}

			if (href) {

			}
			else if (to && guardLinkEvent(e)) {
				try {
					const route = getNextRoute();
					const method = replace ? router.replace : router.push;

					method.call(router, route.location).catch(error => undefined);
				}
				catch(error) {
					console.error(error);
				}
			}
		}
	},

	render(h) {
		const { $slots: slots, classNamePrefix: customizedClassNamePrefix, name, disabled, href, to, target, getNextRoute } = this;
		const { handleClick } = this;

		let icon;

		if (slots.icon) {
			icon = slots.icon;
		}
		else if (this.icon) {
			icon = (
				<VuiIcon type={this.icon} />
			);
		}

		let title = slots.title || this.title;

		const classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "dropdown-menu-item");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-disabled`]: disabled
		};
		classes.elIcon = `${classNamePrefix}-icon`;
		classes.elTitle = `${classNamePrefix}-title`;

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
			const linkProps = {
				attrs: {
					href: href || getNextRoute().href,
					target
				},
				class: classes.el,
				on: {
					click: handleClick
				}
			};

			return (
				<a {...linkProps}>{children}</a>
			);
		}
		else {
			const buttonProps = {
				class: classes.el,
				on: {
					click: handleClick
				}
			};

			return (
				<div {...buttonProps}>{children}</div>
			);
		}
	}
};

export default VuiDropdownMenuItem;