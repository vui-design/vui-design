import Locale from "vui-design/mixins/locale";
import is from "vui-design/utils/is";
import { on, off, isInContainer, getScrollContainer } from "vui-design/utils/dom";
import throttle from "vui-design/utils/throttle";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const isSupportObjectFit = () => document.documentElement.style.objectFit !== undefined;

const VuiImage = {
	name: "vui-image",

	mixins: [
		Locale
	],

	inheritAttrs: false,

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		src: {
			type: String,
			default: undefined
		},
		filled: {
			type: Boolean,
			default: false
		},
		fit: {
			type: String,
			default: undefined,
			validator: value => ["fill", "contain", "cover", "none", "scale-down"].indexOf(value) > -1
		},
		alt: {
			type: String,
			default: undefined
		},
		placeholder: {
			type: String,
			default: undefined
		},
		referrerPolicy: {
			type: String,
			default: undefined
		},
		lazyload: {
			type: Boolean,
			default: false
		},
		scrollContainer: {
			default: undefined
		},
		animation: {
			type: String,
			default: "vui-image-fade"
		}
	},

	data() {
		let { $props: props } = this;
		let state = {
			loading: true,
			error: false,
			visibility: !props.lazyload,
			imageWidth: 0,
			imageHeight: 0
		};

		return {
			state
		};
	},

	computed: {
		visibility() {
			return this.state.visibility;
		}
	},

	watch: {
		src(value) {
			this.state.visibility && this.loadImage();
		},
		visibility(value) {
			value && this.loadImage();
		}
	},

	methods: {
		getImageStyle(fit) {
			let { $el: el, state } = this;
			let { clientWidth: containerWidth, clientHeight: containerHeight } = el;
			let { imageWidth, imageHeight } = state;

			if (!containerWidth || !containerHeight || !imageWidth || !imageHeight) {
				return {};
			}

			let vertical = imageWidth / imageHeight < 1;

			if (fit === "scale-down") {
				let isSmaller = imageWidth < containerWidth && imageHeight < containerHeight;

				fit = isSmaller ? "none" : "contain";
			}

			switch(fit) {
				case "none":
					return { width: "auto", height: "auto" };
				case "contain":
					return vertical ? { width: "auto" } : { height: "auto" };
				case "cover":
					return vertical ? { height: "auto" } : { width: "auto" };
				default:
					return {};
			}
		},
		loadImage() {
			if (is.server) {
				return;
			}

			this.state.loading = true;
			this.state.error = false;

			let { $props: props, $attrs: attrs } = this;
			let image = new Image();

			image.onload = e => this.handleLoad(e, image);
			image.onerror = e => this.handleError(e, image);

			Object.keys(attrs).forEach(key => {
				let value = attrs[key];

				image.setAttribute(key, value);
			});

			image.src = props.src;
		},
		addLazyloadListener() {
			if (is.server) {
				return;
			}

			let { $el: el, $props: props } = this;
			let scrollContainer = props.scrollContainer;
			let container = null;

			if (is.string(scrollContainer)) {
				container = document.querySelector(scrollContainer);
			}
			else if (is.element(scrollContainer)) {
				container = scrollContainer;
			}
			else if (is.function(scrollContainer)) {
				container = scrollContainer(el);
			}
			else {
				container = getScrollContainer(el);
			}

			if (!container) {
				return;
			}

			this.container = container;
			this.lazyloadHandler = throttle(this.handleLazyload, 200);
			this.handleLazyload();

			on(container, "scroll", this.lazyloadHandler);
		},
		removeLazyloadListener() {
			let { container, lazyloadHandler } = this;

			if (is.server || !container || !lazyloadHandler) {
				return;
			}

			this.container = null;
			this.lazyloadHandler = null;

			off(container, "scroll", lazyloadHandler);
		},
		handleLazyload() {
			let { $el: el, container } = this;

			if (isInContainer(el, container)) {
				this.state.visibility = true;
				this.removeLazyloadListener();
			}
		},
		handleLoad(e, image) {
			this.state.loading = false;
			this.state.error = false;
			this.state.imageWidth = image.width;
			this.state.imageHeight = image.height;
			this.$emit("load", e, image);
		},
		handleError(e, image) {
			this.state.loading = false;
			this.state.error = true;
			this.$emit("error", e, image);
		}
	},

	mounted() {
		let { $props: props } = this;

		if (props.lazyload) {
			this.addLazyloadListener();
		}
		else {
			this.loadImage();
		}
	},

	beforeDestroy() {
		let { $props: props } = this;

		props.lazyload && this.removeLazyloadListener();
	},

	render(h) {
		let { $slots: slots, $props: props, $attrs: attrs, state, $listeners: listeners, t: translate } = this;
		let center = !is.server && !isSupportObjectFit() && props.fit !== "fill";
		let viewable = is.array(props.viewer) && props.viewer.length > 0;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "image");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-filled`]: props.filled
		};
		classes.elPlaceholder = `${classNamePrefix}-placeholder`;
		classes.elError = `${classNamePrefix}-error`;
		classes.elImage = {
			[`${classNamePrefix}-image`]: true,
			[`${classNamePrefix}-image-center`]: center,
			[`${classNamePrefix}-image-viewable`]: viewable
		};

		// style
		let styles = {};

		if (!is.server && props.fit) {
			if (isSupportObjectFit()) {
				styles.elImage = {
					objectFit: props.fit
				};
			}
			else {
				styles.elImage = this.getImageStyle(props.fit);
			}
		}

		// render
		let children = [];

		if (state.loading) {
			children.push(
				<div class={classes.elPlaceholder}>
					{slots.placeholder || props.placeholder}
				</div>
			);
		}
		else if (state.error) {
			children.push(
				<div class={classes.elError}>
					{slots.error || props.alt || translate("vui.image.error")}
				</div>
			);
		}
		else {
			let rest = {
				class: classes.elImage,
				style: styles.elImage,
				attrs: {
					...attrs,
					src: props.src,
					alt: props.alt
				},
				on: {
					...listeners
				}
			};

			children.push(
				<transition appear name={props.animation}>
					<img {...rest} />
				</transition>
			);
		}

		return (
			<div class={classes.el}>
				{children}
			</div>
		);
	}
};

export default VuiImage;