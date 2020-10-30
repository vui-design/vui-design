import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiRow = {
	name: "vui-row",
	provide() {
		return {
			vuiRow: this
		};
	},
	props: {
		classNamePrefix: PropTypes.string,
		type: PropTypes.oneOf(["flex"]),
		justify: PropTypes.oneOf(["start", "center", "end", "space-around", "space-between"]).def("start"),
		align: PropTypes.oneOf(["top", "middle", "bottom"]).def("top"),
		gutter: PropTypes.number.def(0)
	},
	render(h) {
		const { $slots: slots, $props: props } = this;

		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "row");
		let classes = {
			[`${classNamePrefix}`]: !props.type,
			[`${classNamePrefix}-${props.type}`]: props.type,
			[`${classNamePrefix}-justify-${props.justify}`]: props.type === "flex",
			[`${classNamePrefix}-align-${props.align}`]: props.type === "flex"
		};

		let styles = {};

		if (props.gutter) {
			styles.marginLeft = props.gutter / -2 + "px";
			styles.marginRight = styles.marginLeft;
		}

		return (
			<div class={classes} style={styles}>{slots.default}</div>
		);
	}
};

export default VuiRow;