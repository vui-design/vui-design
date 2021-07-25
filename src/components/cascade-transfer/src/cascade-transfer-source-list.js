import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiCascadeTransferSourceList = {
	name: "vui-cascade-transfer-source-list",
	props: {
		classNamePrefix: PropTypes.string
	},
	render(h) {
		const { $slots: slots, $props: props } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "source-list");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		// render
		return (
			<div class={classes.el}>
				{slots.default}
			</div>
		);
	}
};

export default VuiCascadeTransferSourceList;