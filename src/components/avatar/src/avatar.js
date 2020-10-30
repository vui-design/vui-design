import VuiIcon from "vui-design/components/icon";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const shapes = ["circle", "square"];
const sizes = ["small", "medium", "large"];

const VuiAvatar = {
	name: "vui-avatar",
	components: {
		VuiIcon
	},
	props: {
		classNamePrefix: PropTypes.string,
		src: PropTypes.string,
		alt: PropTypes.string,
		icon: PropTypes.string,
		shape: PropTypes.oneOf(shapes).def("circle"),
		size: PropTypes.oneOfType([PropTypes.oneOf(sizes), PropTypes.number]).def("medium")
	},
	data() {
		const state = {
			scale: 1
		};

		return {
			state
		};
	},
	methods: {
		response() {
			const { $el: el, $refs: references } = this;

			if (!references.children) {
				return;
			}

			const boundary = el.getBoundingClientRect().width;
			const width = references.children.offsetWidth;
			const isOverflowed = boundary - 8 < width;

			this.state.scale = isOverflowed ? ((boundary - 8) / width) : 1;
		},
		handleError(e) {
			this.$emit("error", e);
		}
	},
	mounted() {
		this.response();
	},
	updated() {
		this.response();
	},
	render() {
		const { $slots: slots, $props: props, state, $listeners: listeners } = this;
		const { handleError } = this;
		const isPresetSize =  sizes.indexOf(props.size) > -1;

		// type
		let type;

		if (props.src) {
			type = "image";
		}
		else if (slots.icon || props.icon) {
			type = "icon";
		}
		else if (slots.default) {
			type = "children";
		}

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "avatar");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-with-${type}`]: type,
			[`${classNamePrefix}-${props.shape}`]: props.shape,
			[`${classNamePrefix}-${props.size}`]: props.size && isPresetSize
		};
		classes.elChildren = `${classNamePrefix}-${type}`;

		// style
		let styles = {};

		if (props.size && !isPresetSize) {
			styles.el = {
				width: `${props.size}px`,
				height: `${props.size}px`,
				lineHeight: `${props.size}px`,
				fontSize: `${props.size / 2}px`
			};
		}

		if (type === "children") {
			styles.elChildren = {
				transform: `scale(${state.scale}) translateX(-50%)`
			};
		}

		// attributes
		const attributes = {
			class: classes.el,
			style: styles.el,
			on: {
				...listeners
			}
		};

		// render
		let children;

		if (type === "image") {
			children = (
				<img class={classes.elChildren} src={props.src} alt={props.alt} onError={handleError} />
			);
		}
		else if (type === "icon") {
			children = slots.icon || (
				<VuiIcon type={props.icon} class={classes.elChildren} />
			);
		}
		else if (type === "children") {
			children = (
				<div ref="children" class={classes.elChildren} style={styles.elChildren}>{slots.default}</div>
			);
		}

		return (
			<div {...attributes}>{children}</div>
		);
	}
};

export default VuiAvatar;