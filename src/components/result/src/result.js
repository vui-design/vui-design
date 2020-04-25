import VuiIcon from "vui-design/components/icon";
import VuiResultException from "./result-exception";

const mapIconTypes = {
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
			validator: value => ["info", "warning", "success", "error", "403", "404", "500"].indexOf(value) > -1
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
		let { $slots, classNamePrefix, status } = this;

		// icon
		let icon;

		if ($slots.icon) {
			icon = $slots.icon;
		}
		else {
			if (["info", "warning", "success", "error"].indexOf(status) > -1) {
				let iconType = this.icon || mapIconTypes[status];

				icon = (
					<VuiIcon type={iconType} />
				);
			}
			else {
				icon = (
					<VuiResultException status={status} width={300} />
				);
			}
		}

		// title
		let title = $slots.title || this.title;

		// description
		let description = $slots.description || this.description;

		// content
		let content = $slots.default || $slots.content;

		// extra
		let extra = $slots.extra;

		// render
		return (
			<div class={`${classNamePrefix} ${classNamePrefix}-${status}`}>
				{icon && <div class={`${classNamePrefix}-icon`}>{icon}</div>}
				{title && <div class={`${classNamePrefix}-title`}>{title}</div>}
				{description && <div class={`${classNamePrefix}-description`}>{description}</div>}
				{content && <div class={`${classNamePrefix}-content`}>{content}</div>}
				{extra && <div class={`${classNamePrefix}-extra`}>{extra}</div>}
			</div>
		);
	}
};

export default VuiResult;