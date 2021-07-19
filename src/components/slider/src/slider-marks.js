import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

const VuiSliderMarks = {
	name: "vui-slider-marks",
	props: {
		classNamePrefix: PropTypes.string.def("vui-slider"),
		vertical: PropTypes.bool.def(false),
		value: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
		range: PropTypes.bool.def(false),
		included: PropTypes.bool.def(true),
		min: PropTypes.number.def(0),
		max: PropTypes.number.def(100),
		marks: PropTypes.object,
		markStyle: PropTypes.object,
		activeMarkStyle: PropTypes.object
	},
	render(h) {
		const { $props: props } = this;
		const difference = props.max - props.min;
		const marks = utils.getMarks(props.min, props.max, props.marks);

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
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "marks");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true
		};

		// render
		if (marks.length === 0) {
			return null;
		}

		return (
			<div class={classes.el}>
				{
					marks.map(mark => {
						const position = (mark.value - props.min) / difference * 100 + "%";
						let isActive = false;

						if (props.included) {
							isActive = mark.value >= min && mark.value <= max;
						}
						else {
							isActive = mark.value === max;
						}

						const markClass = {
							[`${classNamePrefix}-item`]: true,
							[`${classNamePrefix}-item-active`]: isActive
						};

						let markStyle = {
							...props.markStyle
						};

						if (is.json(mark.attributes.style)) {
							markStyle = { ...markStyle, ...mark.attributes.style };
						}

						if (isActive) {
							markStyle = { ...markStyle, ...props.activeMarkStyle };
						}

						if (props.vertical) {
							markStyle.bottom = position;
						}
						else {
							markStyle.left = position;
						}

						let label;

						if (is.function(mark.attributes.label)) {
							label = mark.attributes.label(h, mark.value, mark.attributes);
						}
						else {
							label = mark.attributes.label;
						}

						return (
							<div key={mark.value} class={markClass} style={markStyle}>
								{label}
							</div>
						);
					})
				}
			</div>
		);
	}
};

export default VuiSliderMarks;