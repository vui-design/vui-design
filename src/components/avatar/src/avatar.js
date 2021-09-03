import VuiIcon from "../../icon";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const shapes = ["circle", "square"];
const sizes = ["small", "medium", "large"];

const VuiAvatar = {
	name: "vui-avatar",
	inject: {
		vuiAvatarGroup: {
			default: undefined
		}
	},
	components: {
		VuiIcon
	},
	props: {
		classNamePrefix: PropTypes.string,
		src: PropTypes.string,
		replacement: PropTypes.string,
		alt: PropTypes.string,
		icon: PropTypes.string,
		shape: PropTypes.oneOf(shapes),
		size: PropTypes.oneOfType([PropTypes.oneOf(sizes), PropTypes.number])
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
		const { vuiAvatarGroup, $slots: slots, $props: props, state, $listeners: listeners } = this;
		const { handleError } = this;

		// src
		const src = props.src || props.replacement;

		// type
		let type;

		if (src) {
			type = "image";
		}
		else if (slots.icon || props.icon) {
			type = "icon";
		}
		else if (slots.default) {
			type = "children";
		}

		// shape
		let shape;

		if (vuiAvatarGroup && vuiAvatarGroup.shape) {
			shape = vuiAvatarGroup.shape;
		}
		else if (props.shape) {
			shape = props.shape;
		}
		else {
			shape = "circle";
		}

		// size
		let size;

		if (vuiAvatarGroup && vuiAvatarGroup.size) {
			size = vuiAvatarGroup.size;
		}
		else if (props.size) {
			size = props.size;
		}
		else {
			size = "medium";
		}

		const isPresetSize =  sizes.indexOf(size) > -1;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "avatar");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-with-${type}`]: type,
			[`${classNamePrefix}-${shape}`]: shape,
			[`${classNamePrefix}-${size}`]: size && isPresetSize
		};
		classes.elChildren = `${classNamePrefix}-${type}`;

		// style
		let styles = {};

		if (size && !isPresetSize) {
			styles.el = {
				width: `${size}px`,
				height: `${size}px`,
				lineHeight: `${size}px`,
				fontSize: `${size / 2}px`
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
				<img class={classes.elChildren} src={src} alt={props.alt} onError={handleError} />
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