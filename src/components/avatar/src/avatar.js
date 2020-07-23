import VuiIcon from "vui-design/components/icon";
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
		classNamePrefix: {
			type: String,
			default: undefined
		},
		src: {
			type: String,
			default: undefined
		},
		alt: {
			type: String,
			default: undefined
		},
		icon: {
			type: String,
			default: undefined
		},
		shape: {
			type: String,
			default: "circle",
			validator: value => shapes.indexOf(value) > -1
		},
		size: {
			type: [String, Number],
			default: undefined,
			validator: value => sizes.indexOf(value) > -1 || is.number(value)
		}
	},

	data() {
		let state = {
			scale: 1
		};

		return {
			state
		};
	},

	methods: {
		response() {
			if (!this.$refs.children) {
				return;
			}

			let boundary = this.$el.getBoundingClientRect().width;
			let width = this.$refs.children.offsetWidth;
			let isOverflowed = boundary - 8 < width;

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
		let { $slots: slots, $props: props, state, $listeners: listeners } = this;
		let { handleError } = this;

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

		// size
		let size;
		let isPresetSize;

		if (props.size) {
			size = props.size;
		}
		else {
			size = "medium";
		}

		isPresetSize =  sizes.indexOf(size) > -1;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "avatar");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-with-${type}`]: type,
			[`${classNamePrefix}-${props.shape}`]: props.shape,
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
				fontSize: `${size / 2}px`,
			};
		}

		if (type === "children") {
			styles.elChildren = {
				transform: `scale(${state.scale}) translateX(-50%)`
			};
		}

		// attributes
		let attributes = {
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
			<div {...attributes}>
				{children}
			</div>
		);
	}
};

export default VuiAvatar;