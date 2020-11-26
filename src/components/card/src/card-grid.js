import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiCardGrid = {
	name: "vui-card-grid",
	props: {
		classNamePrefix: PropTypes.string
	},
	render(h) {
		const { $slots: slots, $props: props } = this;

		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "card-grid");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		return (
			<div class={classes.el}>{slots.default}</div>
		);
	}
};

export default VuiCardGrid;