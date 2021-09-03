import VuiIcon from "../../icon";
import MixinLink from "../../../mixins/link";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import guardLinkEvent from "../../../utils/guardLinkEvent";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

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
		classNamePrefix: PropTypes.string,
		name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		icon: PropTypes.string,
		title: PropTypes.string,
		disabled: PropTypes.bool.def(false)
	},
	methods: {
		handleClick(e) {
			const { vuiDropdown, vuiDropdownMenu, vuiDropdownSubmenu, $router: router, $props: props, href, to, replace, getNextRoute } = this;

			if (props.disabled) {
				return e.preventDefault();
			}

			let value = props.value;

			if (is.undefined(value)) {
				value = props.name;
			}

			vuiDropdownMenu.$emit("click", value);

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
		const { $slots: slots, $props: props, href, to, target, getNextRoute } = this;
		const { handleClick } = this;

		// icon
		let icon;

		if (slots.icon) {
			icon = slots.icon;
		}
		else if (props.icon) {
			icon = (
				<VuiIcon type={props.icon} />
			);
		}

		// title
		const title = slots.title || props.title;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown-menu-item");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-disabled`]: props.disabled
		};
		classes.elIcon = `${classNamePrefix}-icon`;
		classes.elTitle = `${classNamePrefix}-title`;

		// render
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