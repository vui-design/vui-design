import PropTypes from "vui-design/utils/prop-types";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

const VuiSliderTrack = {
	name: "vui-slider-track",
	props: {
		classNamePrefix: PropTypes.string.def("vui-slider"),
		vertical: PropTypes.bool.def(false),
		value: PropTypes.oneOfType([PropTypes.number, PropTypes.array]),
		range: PropTypes.bool.def(false),
		included: PropTypes.bool.def(true),
		min: PropTypes.number.def(0),
		max: PropTypes.number.def(100),
		step: PropTypes.number.def(1),
		marks: PropTypes.object,
		getContainer: PropTypes.func.def(element => element.parentNode),
		disabled: PropTypes.bool.def(false)
	},
	methods: {
		handleMousedown(e) {
			e.preventDefault();
		},
		handleClick(e) {
			const { $props: props } = this;

			if (props.disabled || (!props.step && !props.marks)) {
				return;
			}

			const container = props.getContainer();
			const size = utils.getSliderSize(container, props.vertical);
			let position;

			if (props.vertical) {
				const rectY = container.getBoundingClientRect().bottom;

				position = (rectY - e.clientY) / size * 100
			}
			else {
				const rectX = container.getBoundingClientRect().left;

				position = (e.clientX - rectX) / size * 100;
			}

			const value = utils.getSliderDraggerValue(position, props);
			let type;

			if (props.range) {
				type = Math.abs(props.value[0] - value) < Math.abs(props.value[1] - value) ? "min" : "max";
			}
			else {
				type = "max";
			}

			this.$emit("click", type, value);
		}
	},
	render(h) {
		const { $props: props } = this;
		const difference = props.max - props.min;

		// value
		let value = props.value;

		if (props.range) {
			value = clone(value);
			value.sort((a, b) => a - b);
		}

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "track");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elBar = `${classNamePrefix}-bar`;

		// render
		let bar;

		if (props.included) {
			let position;
			let size;

			if (props.range) {
				position = (value[0] - props.min) / difference * 100 + "%";
				size = (value[1] - value[0]) / difference * 100 + "%";
			}
			else {
				position = "0%";
				size = (value - props.min) / difference * 100 + "%";
			}

			let barStyle = {};

			if (props.vertical) {
				barStyle.bottom = position;
				barStyle.height = size;
			}
			else {
				barStyle.left = position;
				barStyle.width = size;
			}

			bar = (
				<div class={classes.elBar} style={barStyle}></div>
			);
		}

		return (
			<div class={classes.el} onMousedown={this.handleMousedown} onClick={this.handleClick}>
				{bar}
			</div>
		);
	}
};

export default VuiSliderTrack;