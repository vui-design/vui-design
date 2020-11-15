import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiTransferOperation = {
	name: "vui-transfer-operation",
	props: {
		classNamePrefix: PropTypes.string
	},
	data() {
		const state = {

		};

		return {
			state
		};
	},
	methods: {
		
	},
	render() {
		const { $slots: slots, $props: props, state } = this;

		// classes
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "operation");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true
		};

		// render
		return (
			<div class={classes.el}>

			</div>
		);
	}
};

export default VuiTransferOperation;