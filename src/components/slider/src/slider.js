import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiSlider = {
	name: "vui-slider",
	props: {
		classNamePrefix: PropTypes.string,
	},
	data() {
		const state = {

		};

		return {
			state
		};
	},
	watch: {

	},
	methods: {

	},
	render() {
		const { $slots: slots, $props: props, state } = this;

		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "slider");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true
		};
		classes.elRail = `${classNamePrefix}-rail`;
		classes.elTrack = `${classNamePrefix}-track`;
		classes.elSteps = `${classNamePrefix}-steps`;
		classes.elStep = `${classNamePrefix}-step`;
		classes.elMarks = `${classNamePrefix}-marks`;
		classes.elMark = `${classNamePrefix}-mark`;
		classes.elHandle = `${classNamePrefix}-handle`;

		return (
			<div class={classes.el}>
				<div class={classes.elRail}></div>
				<div class={classes.elTrack}></div>
				<div class={classes.elSteps}></div>
				<div class={classes.elMarks}></div>
				<div tabIndex="0" class={classes.elHandle}></div>
			</div>
		);
	}
};

export default VuiSlider;