import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getValidElements from "vui-design/utils/getValidElements";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const sizes = ["small", "medium", "large"];

const VuiSpace = {
	name: "vui-space",
	props: {
		classNamePrefix: PropTypes.string,
		direction: PropTypes.oneOf(["horizontal", "vertical"]).def("horizontal"),
		align: PropTypes.oneOf(["start", "center", "end"]).def("center"),
		size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def("medium")
	},
	render(h) {
		const { $slots: slots, $props: props } = this;
		const isHorizontal = props.direction === "horizontal";
		const withPresetSize = props.size && sizes.indexOf(props.size) > -1;
		const withCustomSize = props.size && sizes.indexOf(props.size) === -1;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "space");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.direction}`]: props.direction,
			[`${classNamePrefix}-${props.align}`]: isHorizontal && props.align,
			[`${classNamePrefix}-${props.size}`]: withPresetSize
		};
		classes.elItem = `${classNamePrefix}-item`;

		// style
		let styles = {};

		if (withCustomSize) {
			const property = isHorizontal ? "marginLeft" : "marginTop";

			styles.elItem = {
				[`${property}`]: is.string(props.size) ? props.size : `${props.size}px`
			};
		}

		// render
		const list = getValidElements(slots.default);
		let children = [];

		list.forEach((item, index) => {
			let isNotFirst = index > 0;

			children.push(
				<div class={classes.elItem} style={isNotFirst && styles.elItem}>{item}</div>
			);
		});

		return (
			<div class={classes.el}>
				{children}
			</div>
		);
	}
};

export default VuiSpace;