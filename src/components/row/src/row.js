const VuiRow = {
	name: "vui-row",

	provide() {
		return {
			vuiRow: this
		};
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-row"
		},
		type: {
			type: String,
			default: undefined,
			validator(value) {
				return ["flex"].indexOf(value) > -1;
			}
		},
		justify: {
			type: String,
			default: "start",
			validator(value) {
				return ["start", "center", "end", "space-around", "space-between"].indexOf(value) > -1;
			}
		},
		align: {
			type: String,
			default: "top",
			validator(value) {
				return ["top", "middle", "bottom"].indexOf(value) > -1;
			}
		},
		gutter: {
			type: Number,
			default: 0
		}
	},

	render(h) {
		let { $slots, classNamePrefix, type, justify, align, gutter } = this;

		// classes
		let classes = {
			[`${classNamePrefix}`]: !type,
			[`${classNamePrefix}-${type}`]: type,
			[`${classNamePrefix}-justify-${justify}`]: type === "flex",
			[`${classNamePrefix}-align-${align}`]: type === "flex"
		};

		// styles
		let styles = {};

		if (gutter) {
			styles.marginLeft = gutter / -2 + "px";
			styles.marginRight = styles.marginLeft;
		}

		// render
		return (
			<div class={classes} style={styles}>
				{$slots.default}
			</div>
		);
	}
};

export default VuiRow;