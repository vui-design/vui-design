import VuiIcon from "vui-design/components/icon";
import MixinLink from "vui-design/mixins/link";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiBreadcrumbItem = {
	name: "vui-breadcrumb-item",

	inject: {
		vuiBreadcrumb: {
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
		icon: {
			type: String,
			default: undefined
		},
		title: {
			type: String,
			default: undefined
		}
	},

	render() {
		let { vuiBreadcrumb, $slots: slots, classNamePrefix: customizedClassNamePrefix, href, to, target, getNextRoute, handleLinkClick } = this;

		// class
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "breadcrumb-item");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elLink = `${classNamePrefix}-link`;
		classes.elLabel = `${classNamePrefix}-label`;
		classes.elSeparator = `${classNamePrefix}-separator`;

		// icon
		let icon;

		if (this.icon) {
			icon = (
				<VuiIcon type={this.icon} />
			);
		}

		// title
		let title;

		if (slots.default) {
			title = slots.default;
		}
		else if (this.title) {
			title = this.title;
		}

		// render
		let children = [];

		if (href || to) {
			let props = {
				attrs: {
					target
				},
				class: classes.elLink,
				on: {
					click: handleLinkClick
				}
			};

			if (href) {
				props.attrs.href = href;
			}
			else {
				let next = getNextRoute();

				props.attrs.href = next.href;
			}

			children.push(
				<a {...props}>
					{icon}
					{title}
				</a>
			);
		}
		else {
			children.push(
				<label class={classes.elLabel}>
					{icon}
					{title}
				</label>
			);
		}

		children.push(
			<div class={classes.elSeparator}>
				{vuiBreadcrumb.separator}
			</div>
		);

		return (
			<div class={classes.el}>
				{children}
			</div>
		);
	}
};

export default VuiBreadcrumbItem;