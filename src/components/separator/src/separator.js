import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import getValidElements from "vui-design/utils/getValidElements";

const VuiSeparator = {
	name: "vui-separator",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		align: {
			type: String,
			default: "left",
			validator: value => ["left", "center", "right"].indexOf(value) > -1
		},
		size: {
			type: [Number, String],
			default: 12
		},
		gutter: {
			type: [Number, String],
			default: 10
		}
	},

	render(h) {
		let { $slots: slots, $props: props } = this;

		// size
		let size;

		if (is.number(props.size)) {
			size = props.size + "px";
		}
		else if (is.string(props.size)) {
			size = props.size;
		}
		else {
			size = "12px";
		}

		// gutter
		let gutter;

		if (is.number(props.gutter)) {
			gutter = props.gutter + "px";
		}
		else if (is.string(props.gutter)) {
			gutter = props.gutter;
		}
		else {
			gutter = "10px";
		}

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "separator");
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
		let children = [];
		let actions = getValidElements(slots.default);

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