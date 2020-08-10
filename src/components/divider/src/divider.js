import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiDivider = {
	name: "vui-divider",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		type: {
			type: String,
			default: "horizontal",
			validator: value => ["horizontal", "vertical"].indexOf(value) > -1
		},
		dashed: {
			type: Boolean,
			default: false
		},
		orientation: {
			type: String,
			default: "center",
			validator: value => ["left", "center", "right"].indexOf(value) > -1
		},
		gutter: {
			type: [String, Number],
			default: undefined
		}
	},

	render() {
		let { $slots: slots, $props: props } = this;
		let withText = props.type === "horizontal" && slots.default;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "divider");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.type}`]: props.type,
			[`${classNamePrefix}-dashed`]: props.dashed,
			[`${classNamePrefix}-with-text`]: withText,
			[`${classNamePrefix}-with-text-${props.orientation}`]: withText
		};
		classes.elText = `${classNamePrefix}-text`;

		// style
		let styles = {};

		if (props.gutter !== undefined) {
			let gutter = is.string(props.gutter) ? props.gutter : `${props.gutter}px`;

			if (type === "horizontal") {
				styles.el = {
					marginTop: gutter,
					marginBottom: gutter
				};
			}
			else {
				styles.el = {
					marginLeft: gutter,
					marginRight: gutter
				};
			}
		}

		// render
		return (
			<div class={classes.el} style={styles.el}>
				{
					withText && (
						<div class={classes.elText}>{slots.default}</div>
					)
				}
			</div>
		);
	}
};

export default VuiDivider;