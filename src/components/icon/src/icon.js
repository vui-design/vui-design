import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import "vui-design/icons";

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
		let name = "#icon-" + props.type;

		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "icon");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.type}`]: props.type
		};

		let styles = {};

		styles.el = {
			color: props.color,
			fontSize: is.number(props.size) ? (props.size + "px") : (is.string(props.size) ? props.size : undefined)
		}

		let attributes = {
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