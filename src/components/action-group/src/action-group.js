import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import getValidElements from "vui-design/utils/getValidElements";

const VuiActionGroup = {
	name: "vui-action-group",

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
		gutter: {
			type: [Number, String],
			default: 10
		}
	},

	render(h) {
		let { $slots: slots, $props: props } = this;

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
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "action-group");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.align}`]: props.align
		};
		classes.elItem = `${classNamePrefix}-item`;
		classes.elItemSeparator = `${classNamePrefix}-item-separator`;

		// style
		let styles = {};

		styles.elItemSeparator = {
			marginLeft: gutter,
			marginRight: gutter
		};

		// render
		let children = [];
		let actions = getValidElements(slots.default);

		actions.forEach((action, index) => {
			if (index > 0) {
				children.push(
					<i class={classes.elItemSeparator} style={styles.elItemSeparator}></i>
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

export default VuiActionGroup;