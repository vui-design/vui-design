import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiSlider = {
	name: "vui-slider",
	props: {
		classNamePrefix: PropTypes.string,
		vertical: PropTypes.bool.def(false),
		reverse: PropTypes.bool.def(false),
		value: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
		range: PropTypes.bool.def(false),
		min: PropTypes.number.def(0),
		max: PropTypes.number.def(100),
		step: PropTypes.number.def(0),
		marks: PropTypes.object,
		tooltip: PropTypes.object,
		disabled: PropTypes.bool.def(false)
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
				<div class={classes.elSteps}>
					<div class={[classes.elStep, classes.elStep + "-active"]} style="left: 0%;"></div>
					<div class={[classes.elStep, classes.elStep + "-active"]} style="left: 26%;"></div>
					<div class={[classes.elStep, classes.elStep + "-active"]} style="left: 38%;"></div>
					<div class={classes.elStep} style="left: 100%;"></div>
				</div>
				<div class={classes.elMarks}>
					<div class={[classes.elMark, classes.elMark + "-active"]} style="left: 0%;">0°C</div>
					<div class={[classes.elMark, classes.elMark + "-active"]} style="left: 26%;">26°C</div>
					<div class={[classes.elMark, classes.elMark + "-active"]} style="left: 38%;">38°C</div>
					<div class={classes.elMark} style="left: 100%;">100°C</div>
				</div>
				<div tabIndex="0" class={classes.elHandle}></div>
			</div>
		);
	}
};

export default VuiSlider;