import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiCellGroup = {
	name: "vui-cell-group",
	provide() {
		return {
			vuiCellGroup: this
		};
	},
	props: {
		classNamePrefix: PropTypes.string,
		title: PropTypes.string,
		description: PropTypes.string
	},
	render(h) {
		const { $slots: slots, $props: props } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "cell-group");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elTitle = `${classNamePrefix}-title`;
		classes.elDescription = `${classNamePrefix}-description`;

		// render
		let children = [];

		if (props.title) {
			children.push(
				<div class={classes.elTitle}>{props.title}</div>
			);
		}

		children.push(slots.default);

		if (props.description) {
			children.push(
				<div class={classes.elDescription}>{props.description}</div>
			);
		}

		return (
			<div class={classes.el}>{children}</div>
		);
	}
};

export default VuiCellGroup;