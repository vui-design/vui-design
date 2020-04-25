import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiIcon = {
	name: "vui-icon",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		type: {
			type: String,
			default: undefined
		},
		color: {
			type: String,
			default: undefined
		},
		size: {
			type: [Number, String],
			default: undefined
		}
	},

	render(h) {
		let { $props: props, $listeners: listeners } = this;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "icon");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.type}`]: props.type
		};

		// style
		let styles = {};

		styles.el = {
			color: props.color,
			fontSize: is.number(props.size) ? (props.size + "px") : (is.string(props.size) ? props.size : undefined)
		}

		// render
		let attributes = {
			class: classes.el,
			style: styles.el,
			on: {
				...listeners
			}
		};

		return (
			<i {...attributes}></i>
		);
	}
};

export default VuiIcon;