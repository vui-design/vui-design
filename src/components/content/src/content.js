import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiContent = {
	name: "vui-content",
	props: {
		classNamePrefix: PropTypes.string
	},
	render(h) {
		const { $slots: slots, $props: props } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "layout-content");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true
		};

		// render
		return (
			<div class={classes.el}>
				{slots.default}
			</div>
		);
	}
};

export default VuiContent;