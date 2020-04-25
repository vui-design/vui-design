import MixinLink from "vui-design/mixins/link";
import VuiIcon from "vui-design/components/icon";
import guid from "vui-design/utils/guid";

const VuiCell = {
	name: "vui-cell",

	inject: {
		vuiCellGroup: {
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
			default: "vui-cell"
		},
		icon: {
			type: String,
			default: undefined
		},
		title: {
			type: String,
			default: undefined
		},
		extra: {
			type: String,
			default: undefined
		},
		selected: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		handleCellClick(e) {
			this.$emit("click", e);
		}
	},

	render(h) {
		let { $slots, $attrs, $listeners, classNamePrefix, icon, title, extra, selected, disabled, href, to, target } = this;
		let { getNextRoute } = this;
		let { handleCellClick, handleLinkClick } = this;

		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-selected`]: selected,
			[`${classNamePrefix}-disabled`]: disabled
		};
		classes.header = `${classNamePrefix}-header`;
		classes.body = `${classNamePrefix}-body`;
		classes.footer = `${classNamePrefix}-footer`;
		classes.extra = `${classNamePrefix}-extra`;

		let children = [];

		if ($slots.icon || icon) {
			let header = [];

			if ($slots.icon) {
				header.push($slots.icon);
			}
			else if (icon) {
				header.push(
					<VuiIcon type={icon} />
				);
			}

			children.push(
				<div class={classes.header}>
					{header}
				</div>
			);
		}

		children.push(
			<div class={classes.body}>
				{$slots.default || title}
			</div>
		);

		if ($slots.extra || extra || selected || href || to) {
			let footer = [];

			if ($slots.extra) {
				footer.push(
					<div class={classes.extra}>{$slots.extra}</div>
				);
			}
			else if (extra) {
				footer.push(
					<div class={classes.extra}>{extra}</div>
				);
			}

			if (selected) {
				footer.push(
					<vui-icon type="checkmark" class={classes.icon} />
				);
			}
			else if (href || to) {
				footer.push(
					<vui-icon type="chevron-right" class={classes.icon} />
				);
			}

			children.push(
				<div class={classes.footer}>
					{footer}
				</div>
			);
		}

		let props = {
			attrs: {
				...$attrs
			},
			class: classes.el,
			on: {
				...$listeners
			}
		};

		if (!href && !to) {
			props.on.click = handleCellClick;

			return (
				<div {...props}>
					{children}
				</div>
			);
		}
		else {
			if (href) {
				props.attrs.href = href;
			}
			else {
				let next = getNextRoute();

				props.attrs.href = next.href;
			}

			props.attrs.target = target;
			props.on.click = handleLinkClick;

			return (
				<a {...props}>
					{children}
				</a>
			);
		}
	}
};

export default VuiCell;