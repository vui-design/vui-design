import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import clone from "../../../utils/clone";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";
import utils from "./utils";

const VuiSliderSteps = {
	name: "vui-slider-steps",
	props: {
		classNamePrefix: PropTypes.string.def("vui-slider"),
		vertical: PropTypes.bool.def(false),
		value: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
		range: PropTypes.bool.def(false),
		included: PropTypes.bool.def(true),
		min: PropTypes.number.def(0),
		max: PropTypes.number.def(100),
		step: PropTypes.number.def(1),
		showSteps: PropTypes.bool.def(false),
		stepStyle: PropTypes.object,
		activeStepStyle: PropTypes.object,
		marks: PropTypes.object
	},
	render(h) {
		const { $props: props } = this;
		const difference = props.max - props.min;
		const steps = utils.getSteps(props.min, props.max, props.step, props.showSteps, props.marks);

		// value
		let value = props.value;

		if (props.range) {
			value = clone(value);
			value.sort((a, b) => a - b);
		}

		// min & max
		const min = props.range ? value[0] : props.min;
		const max = props.range ? value[1] : value;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "steps");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true
		};

		// render
		if (steps.length === 0) {
			return null;
		}

		return (
			<div class={classes.el}>
				{
					steps.map(step => {
						const position = (step - props.min) / difference * 100 + "%";
						let isActive = false;

						if (props.included) {
							isActive = step >= min && step <= max;
						}
						else {
							isActive = step === max;
						}

						const stepClass = {
							[`${classNamePrefix}-item`]: true,
							[`${classNamePrefix}-item-active`]: isActive
						};

						let stepStyle = {
							...props.stepStyle
						};

						if (isActive) {
							stepStyle = { ...stepStyle, ...props.activeStepStyle };
						}

						if (props.vertical) {
							stepStyle.bottom = position;
						}
						else {
							stepStyle.left = position;
						}

						return (
							<div key={step} class={stepClass} style={stepStyle}></div>
						);
					})
				}
			</div>
		);
	}
};

export default VuiSliderSteps;