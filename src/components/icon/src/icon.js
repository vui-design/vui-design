import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import "vui-design/icons";

const VuiIcon = {
	name: "vui-icon",
	props: {
		classNamePrefix: PropTypes.string,
		type: PropTypes.string,
		color: PropTypes.string,
		size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	},
	render(h) {
		const { $props: props, $listeners: listeners } = this;

		// name
		const name = "#icon-" + props.type;

		// fontSize
		let fontSize;

		if (is.string(props.size)) {
			fontSize = props.size;
		}
		else if (is.number(props.size)) {
			fontSize = props.size + "px";
		}

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "icon");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.type}`]: props.type
		};

		// style
		let styles = {};

		styles.el = {
			color: props.color,
			fontSize: fontSize
		};

		// render
		const attributes = {
			class: classes.el,
			style: styles.el,
			on: {
				...listeners
			}
		};

		return (
			<i {...attributes}>
				<svg aria-hidden="true">
					<use xlinkHref={name} />
				</svg>
			</i>
		);
	}
};

export default VuiIcon;