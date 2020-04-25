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
		margin: {
			type: [String, Number],
			default: undefined
		}
	},

	render() {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, type, dashed, orientation, margin } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "divider");
		let withText = type === "horizontal" && slots.default;

		// class
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${type}`]: type,
			[`${classNamePrefix}-dashed`]: dashed,
			[`${classNamePrefix}-with-text`]: withText,
			[`${classNamePrefix}-with-text-${orientation}`]: withText
		};
		classes.elText = `${classNamePrefix}-text`;

		// style
		let styles = {};

		if (margin !== undefined) {
			let value = is.string(margin) ? margin : `${margin}px`;

			if (type === "horizontal") {
				styles.el = {
					marginTop: value,
					marginBottom: value
				};
			}
			else {
				styles.el = {
					marginLeft: value,
					marginRight: value
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