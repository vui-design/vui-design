import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getValidElements from "vui-design/utils/getValidElements";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiSeparator = {
	name: "vui-separator",
	props: {
		classNamePrefix: PropTypes.string,
		align: PropTypes.oneOf(["left", "center", "right"]).def("left"),
		size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(12),
		gutter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(10)
	},
	render(h) {
		const { $slots: slots, $props: props } = this;

		// size
		let size;

		if (is.string(props.size)) {
			size = props.size;
		}
		else if (is.number(props.size)) {
			size = props.size + "px";
		}
		else {
			size = "12px";
		}

		// gutter
		let gutter;

		if (is.string(props.gutter)) {
			gutter = props.gutter;
		}
		else if (is.number(props.gutter)) {
			gutter = props.gutter + "px";
		}
		else {
			gutter = "10px";
		}

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "separator");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.align}`]: props.align
		};
		classes.elItem = `${classNamePrefix}-item`;
		classes.elItemDivider = `${classNamePrefix}-item-divider`;

		// style
		let styles = {};

		styles.elItemDivider = {
			height: size,
			marginLeft: gutter,
			marginRight: gutter
		};

		// render
		const actions = getValidElements(slots.default);
		let children = [];

		actions.forEach((action, index) => {
			if (index > 0) {
				children.push(
					<i class={classes.elItemDivider} style={styles.elItemDivider}></i>
				);
			}

			children.push(
				<div class={classes.elItem}>{action}</div>
			);
		});

		return (
			<div class={classes.el}>
				{children}
			</div>
		);
	}
};

export default VuiSeparator;