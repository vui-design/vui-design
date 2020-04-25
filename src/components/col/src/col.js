import is from "vui-design/utils/is";

const VuiCol = {
	name: "vui-col",

	inject: {
		vuiRow: {
			default: undefined
		}
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-col"
		},
		span: {
			type: Number,
			default: 24
		},
		offset: {
			type: Number,
			default: undefined
		},
		push: {
			type: Number,
			default: undefined
		},
		pull: {
			type: Number,
			default: undefined
		},
		order: {
			type: Number,
			default: undefined
		},
		xs: {
			type: [Number, Object],
			default: undefined
		},
		sm: {
			type: [Number, Object],
			default: undefined
		},
		md: {
			type: [Number, Object],
			default: undefined
		},
		lg: {
			type: [Number, Object],
			default: undefined
		},
		xl: {
			type: [Number, Object],
			default: undefined
		},
		xxl: {
			type: [Number, Object],
			default: undefined
		}
	},

	render(h) {
		let { vuiRow, $slots, classNamePrefix } = this;

		// classes
		let classes = [];

		classes.push(`${classNamePrefix}`);

		["span", "offset", "push", "pull", "order"].forEach(key => {
			let value = this[key];

			if (value || value === 0) {
				classes.push(key === "span" ? `${classNamePrefix}-${value}` : `${classNamePrefix}-${key}-${value}`);
			}
		});

		["xs", "sm", "md", "lg", "xl", "xxl"].forEach(key => {
			let value = this[key];

			if (is.number(value)) {
				classes.push(`vui-col-${key}-${value}`);
			}
			else if (is.object(value)) {
				Object.keys(value).forEach(item => {
					classes.push(item === "span" ? `${classNamePrefix}-${key}-${value[item]}` : `${classNamePrefix}-${key}-${item}-${value[item]}`);
				});
			}
		});

		// styles
		let styles = {};

		if (vuiRow && vuiRow.gutter) {
			styles.paddingLeft = vuiRow.gutter / 2 + "px";
			styles.paddingRight = styles.paddingLeft;
		}

		// render
		return (
			<div class={classes} style={styles}>
				{$slots.default}
			</div>
		);
	}
};

export default VuiCol;