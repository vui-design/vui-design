import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiBreadcrumb = {
	name: "vui-breadcrumb",
	provide() {
		return {
			vuiBreadcrumb: this
		};
	},
	props: {
		classNamePrefix: PropTypes.string,
		separator: PropTypes.string.def("/")
	},
	render() {
		const { $slots: slots, $props: props } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "breadcrumb");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		// render
		return (
			<div class={classes.el}>{slots.default}</div>
		);
	}
};

export default VuiBreadcrumb;