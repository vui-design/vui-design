import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import getValidElements from "vui-design/utils/getValidElements";

const VuiSpace = {
	name: "vui-space",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		direction: {
			type: String,
			default: "horizontal",
			validator: value => ["horizontal", "vertical"].indexOf(value) > -1
		},
		align: {
			type: String,
			default: "center",
			validator: value => ["start", "center", "end"].indexOf(value) > -1
		},
		size: {
			type: String,
			default: "medium",
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		gutter: {
			type: [Number, String],
			default: undefined
		}
	},

	render(h) {
		let { $slots: slots, $props: props } = this;
		let isHorizontal = props.direction === "horizontal";

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

		if (is.number(props.gutter)) {
			gutter = props.gutter + "px";
		}
		else if (is.string(props.gutter)) {
			gutter = props.gutter;
		}

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "space");
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
		let children = [];
		let list = getValidElements(slots.default);
		let lastIndex = list.length - 1;

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