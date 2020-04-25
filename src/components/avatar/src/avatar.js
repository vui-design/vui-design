import VuiIcon from "vui-design/components/icon";

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
			default: "vui-avatar"
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
			validator: value => sizes.indexOf(value) > -1 || typeof value === "number"
		}
	},

	data () {
		return {
			scale: 1
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

			this.scale = isOverflowed ? ((boundary - 8) / width) : 1;
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
		let { $vui, $slots, classNamePrefix, src, alt, icon, shape, scale, handleError } = this;

		// type
		let type;

		if (src) {
			type = "image";
		}
		else if ($slots.icon || icon) {
			type = "icon";
		}
		else if ($slots.default) {
			type = "children";
		}

		// size: self > $vui > default
		let size;
		let isPresetSize;

		if (this.size) {
			size = this.size;
		}
		else if ($vui && $vui.size) {
			size = $vui.size;
		}
		else {
			size = "medium";
		}

		isPresetSize =  sizes.indexOf(size) > -1;

		// classes
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-with-image`]: type === "image",
			[`${classNamePrefix}-with-icon`]: type === "icon",
			[`${classNamePrefix}-with-children`]: type === "children",
			[`${classNamePrefix}-${shape}`]: shape,
			[`${classNamePrefix}-${size}`]: size && isPresetSize
		};
		classes.children = {
			[`${classNamePrefix}-image`]: type === "image",
			[`${classNamePrefix}-icon`]: type === "icon",
			[`${classNamePrefix}-children`]: type === "children"
		};

		// styles
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
			styles.children = {
				transform: `scale(${scale}) translateX(-50%)`
			};
		}

		// render
		let children;

		if (type === "image") {
			children = (
				<img class={classes.children} src={src} alt={alt} onError="handleError" />
			);
		}
		else if (type === "icon") {
			children = $slots.icon || (
				<VuiIcon type={icon} class={classes.children} />
			);
		}
		else if (type === "children") {
			children = (
				<div ref="children" class={classes.children} style={styles.children}>{$slots.default}</div>
			);
		}

		return (
			<div class={classes.el} style={styles.el}>
				{children}
			</div>
		);
	}
};

export default VuiAvatar;