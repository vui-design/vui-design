import VuiIcon from "vui-design/components/icon";
import VuiResultException from "./result-exception";
import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

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
		classNamePrefix: PropTypes.string,
		status: PropTypes.oneOf(["info", "warning", "success", "error", "comingsoon", "403", "404", "500"]).def("info"),
		icon: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string
	},
	render() {
		const { $slots: slots, $props: props } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "result");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.status}`]: props.status
		};
		classes.elIcon = `${classNamePrefix}-icon`;
		classes.elTitle = `${classNamePrefix}-title`;
		classes.elDescription = `${classNamePrefix}-description`;
		classes.elContent = `${classNamePrefix}-content`;
		classes.elExtra = `${classNamePrefix}-extra` ;

		// icon
		let icon;

		if (slots.icon) {
			icon = slots.icon;
		}
		else {
			if (["info", "warning", "success", "error"].indexOf(props.status) > -1) {
				let iconType = props.icon;

				if (!iconType) {
					iconType = mapIconTypes[props.status];
				}

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
		const title = slots.title || props.title;

		// description
		const description = slots.description || props.description;

		// content
		const content = slots.default || slots.content;

		// extra
		const extra = slots.extra;

		// render
		return (
			<div class={classes.el}>
				{icon && <div class={classes.elIcon}>{icon}</div>}
				{title && <div class={classes.elTitle}>{title}</div>}
				{description && <div class={classes.elDescription}>{description}</div>}
				{content && <div class={classes.elContent}>{content}</div>}
				{extra && <div class={classes.elExtra}>{extra}</div>}
			</div>
		);
	}
};

export default VuiResult;