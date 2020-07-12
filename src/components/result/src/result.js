import VuiIcon from "vui-design/components/icon";
import VuiResultException from "./result-exception";

const defaultIconTypes = {
	info: "info-filled",
	warning: "warning-filled",
	success: "checkmark-circle-filled",
	error: "crossmark-circle-filled"
};

const VuiResult = {
	name: "vui-result",

	components: {
		VuiIcon,
		VuiResultException
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-result"
		},
		status: {
			type: String,
			default: "info",
			validator: value => ["info", "warning", "success", "error", "comingsoon", "403", "404", "500"].indexOf(value) > -1
		},
		icon: {
			type: String,
			default: undefined
		},
		title: {
			type: String,
			default: ""
		},
		description: {
			type: String,
			default: ""
		}
	},

	render() {
		let { $slots: slots, $props: props } = this;

		// icon
		let icon;

		if (slots.icon) {
			icon = slots.icon;
		}
		else {
			if (["info", "warning", "success", "error"].indexOf(props.status) > -1) {
				let iconType = props.icon || defaultIconTypes[props.status];

				icon = (
					<VuiIcon type={iconType} />
				);
			}
			else {
				icon = (
					<VuiResultException status={props.status} width={300} />
				);
			}
		}

		// title
		let title = slots.title || props.title;

		// description
		let description = slots.description || props.description;

		// content
		let content = slots.default || slots.content;

		// extra
		let extra = slots.extra;

		// render
		return (
			<div class={`${props.classNamePrefix} ${props.classNamePrefix}-${props.status}`}>
				{icon && <div class={`${props.classNamePrefix}-icon`}>{icon}</div>}
				{title && <div class={`${props.classNamePrefix}-title`}>{title}</div>}
				{description && <div class={`${props.classNamePrefix}-description`}>{description}</div>}
				{content && <div class={`${props.classNamePrefix}-content`}>{content}</div>}
				{extra && <div class={`${props.classNamePrefix}-extra`}>{extra}</div>}
			</div>
		);
	}
};

export default VuiResult;