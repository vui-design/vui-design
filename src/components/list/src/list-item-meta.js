import VuiAvatar from "../../avatar";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiListItemMeta = {
	name: "vui-list-item-meta",

	components: {
		VuiAvatar
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		avatar: {
			type: String,
			default: undefined
		},
		title: {
			type: String,
			default: undefined
		},
		description: {
			type: String,
			default: undefined
		}
	},

	render(h) {
		let { $slots: slots, $props: props } = this;

		// classes
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "list-item-meta");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true
		};
		classes.elAvatar = `${classNamePrefix}-avatar`;
		classes.elContent = `${classNamePrefix}-content`;
		classes.elTitle = `${classNamePrefix}-title`;
		classes.elDescription = `${classNamePrefix}-description`;

		// avatar
		let avatar;

		if (slots.avatar) {
			avatar = slots.avatar;
		}
		else if (props.avatar) {
			avatar = (
				<VuiAvatar src={props.avatar} />
			);
		}

		// render
		let children = [];

		if (avatar) {
			children.push(
				<div class={classes.elAvatar}>
					{avatar}
				</div>
			);
		}

		children.push(
			<div class={classes.elContent}>
				<div class={classes.elTitle}>{slots.title || props.title}</div>
				<div class={classes.elDescription}>{slots.description || props.description}</div>
			</div>
		);

		return (
			<div class={classes.el}>
				{children}
			</div>
		);
	}
};

export default VuiListItemMeta;