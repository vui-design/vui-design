import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import getValidElements from "vui-design/utils/getValidElements";

const VuiSpace = {
	name: "vui-space",
	props: {
		classNamePrefix: PropTypes.string,
		direction: PropTypes.oneOf(["horizontal", "vertical"]).def("horizontal"),
		align: PropTypes.oneOf(["start", "center", "end"]).def("center"),
		size: PropTypes.oneOf(["small", "medium", "large"]).def("medium"),
		gutter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	},
	render(h) {
		const { $slots: slots, $props: props } = this;
		const isHorizontal = props.direction === "horizontal";

		// gutter
		let gutter;

		if (props.size === "small") {
			gutter = "8px";
		}
		else if (props.size === "medium") {
			gutter = "16px";
		}
		else if (props.size === "large") {
			gutter = "24px";
		}

		if (is.string(props.gutter)) {
			gutter = props.gutter;
		}
		else if (is.number(props.gutter)) {
			gutter = props.gutter + "px";
		}

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "space");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.direction}`]: props.direction,
			[`${classNamePrefix}-${props.align}`]: isHorizontal && props.align
		};
		classes.elItem = `${classNamePrefix}-item`;

		// style
		let styles = {};

		styles.elItem = {
			marginRight: isHorizontal ? gutter : undefined,
			marginBottom: !isHorizontal ? gutter : undefined
		};

		// render
		const list = getValidElements(slots.default);
		const lastIndex = list.length - 1;
		let children = [];

		list.forEach((item, index) => {
			let isNotLast = index < lastIndex;

			children.push(
				<div class={classes.elItem} style={isNotLast && styles.elItem}>{item}</div>
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