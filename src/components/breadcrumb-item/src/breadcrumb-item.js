import MixinLink from "vui-design/mixins/link";

const VuiBreadcrumbItem = {
	name: "vui-breadcrumb-item",

	inject: {
		vuiBreadcrumb: {
			default: undefined
		}
	},

	mixins: [
		MixinLink
	],

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-breadcrumb-item"
		}
	},

	render() {
		let { vuiBreadcrumb, $slots, classNamePrefix, href, to, target, getNextRoute, handleLinkClick } = this;
		let children = [];

		if (href || to) {
			let props = {
				attrs: {
					target
				},
				class: `${classNamePrefix}-link`,
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
					{$slots.default}
				</a>
			);
		}
		else {
			children.push(
				<label class={`${classNamePrefix}-label`}>
					{$slots.default}
				</label>
			);
		}

		children.push(
			<div class={`${classNamePrefix}-separator`}>
				{vuiBreadcrumb.separator}
			</div>
		);

		return (
			<div class={`${classNamePrefix}`}>
				{children}
			</div>
		);
	}
};

export default VuiBreadcrumbItem;