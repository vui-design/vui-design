import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const shapes = ["circle", "square"];
const sizes = ["small", "medium", "large"];

const VuiSkeletonAvatar = {
	name: "vui-skeleton-avatar",
	props: {
		classNamePrefix: PropTypes.string,
		shape: PropTypes.oneOf(shapes).def("circle"),
		size: PropTypes.oneOfType([PropTypes.oneOf(sizes), PropTypes.number]).def("large")
	},
	render() {
		const { $props: props } = this;
		const isPresetSize =  sizes.indexOf(props.size) > -1;

		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "avatar");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.shape}`]: props.shape,
			[`${classNamePrefix}-${props.size}`]: props.size && isPresetSize
		};

		let styles = {};

		if (props.size && !isPresetSize) {
			styles.el = {
				width: `${props.size}px`,
				height: `${props.size}px`,
				lineHeight: `${props.size}px`
			};
		}

		return (
			<div class={classes.el} style={styles.el}></div>
		);
	}
};

export default VuiSkeletonAvatar;