const VuiDivider = {
	name: "vui-divider",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-divider"
		},
		type: {
			type: String,
			default: "horizontal",
			validator(value) {
				return ["horizontal", "vertical"].indexOf(value) > -1;
			}
		},
		dashed: {
			type: Boolean,
			default: false
		},
		orientation: {
			type: String,
			default: "center",
			validator(value) {
				return ["left", "center", "right"].indexOf(value) > -1;
			}
		},
		margin: {
			type: [String, Number],
			default: undefined
		}
	},

	render() {
		let { $slots, classNamePrefix, type, dashed, orientation, margin } = this;
		let withText = type === "horizontal" && $slots.default;

		// classes
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${type}`]: type,
			[`${classNamePrefix}-dashed`]: dashed,
			[`${classNamePrefix}-with-text`]: withText,
			[`${classNamePrefix}-with-text-${orientation}`]: withText
		};
		classes.elText = `${classNamePrefix}-text`;

		// styles
		let styles = {};

		if (margin !== undefined) {
			let value = `${margin}px`;

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
				{withText && <div class={classes.elText}>{$slots.default}</div>}
			</div>
		);
	}
};

export default VuiDivider;