import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiCol = {
	name: "vui-col",
	inject: {
		vuiRow: {
			default: undefined
		}
	},
	props: {
		classNamePrefix: PropTypes.string,
		span: PropTypes.number.def(24),
		offset: PropTypes.number,
		push: PropTypes.number,
		pull: PropTypes.number,
		order: PropTypes.number,
		xs: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
		sm: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
		md: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
		lg: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
		xl: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
		xxl: PropTypes.oneOfType([PropTypes.number, PropTypes.object])
	},
	render(h) {
		const { vuiRow, $slots: slots, $props: props } = this;

		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "col");
		let classes = [];

		classes.push(`${classNamePrefix}`);

		["span", "offset", "push", "pull", "order"].forEach(key => {
			const value = props[key];

			if (value || value === 0) {
				classes.push(key === "span" ? `${classNamePrefix}-${value}` : `${classNamePrefix}-${key}-${value}`);
			}
		});

		["xs", "sm", "md", "lg", "xl", "xxl"].forEach(key => {
			let value = props[key];

			if (is.number(value)) {
				classes.push(`${classNamePrefix}-${key}-${value}`);
			}
			else if (is.object(value)) {
				Object.keys(value).forEach(item => {
					classes.push(item === "span" ? `${classNamePrefix}-${key}-${value[item]}` : `${classNamePrefix}-${key}-${item}-${value[item]}`);
				});
			}
		});

		let styles = {};

		if (vuiRow && vuiRow.gutter) {
			styles.paddingLeft = vuiRow.gutter / 2 + "px";
			styles.paddingRight = styles.paddingLeft;
		}

		return (
			<div class={classes} style={styles}>{slots.default}</div>
		);
	}
};

export default VuiCol;