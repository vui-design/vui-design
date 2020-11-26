import Locale from "vui-design/mixins/locale";
import PropTypes from "vui-design/utils/prop-types";
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
		classNamePrefix: PropTypes.string,
		src: PropTypes.string,
		replacement: PropTypes.string,
		filled: PropTypes.bool.def(false),
		fit: PropTypes.oneOf(["fill", "contain", "cover", "none", "scale-down"]),
		alt: PropTypes.string,
		placeholder: PropTypes.string,
		referrerPolicy: PropTypes.string,
		lazyload: PropTypes.bool.def(false),
		scrollContainer: PropTypes.any,
		animation: PropTypes.string.def("vui-image-fade")
	},
	data() {
		const { $props: props } = this;
		const state = {
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
		getImageSrc(props) {
			return props.src || props.replacement;
		},
		getImageStyle(fit) {
			const { $el: el, state } = this;
			const { clientWidth: containerWidth, clientHeight: containerHeight } = el;
			const { imageWidth, imageHeight } = state;

			if (!containerWidth || !containerHeight || !imageWidth || !imageHeight) {
				return {};
			}

			const vertical = imageWidth / imageHeight < 1;

			if (fit === "scale-down") {
				const isSmaller = imageWidth < containerWidth && imageHeight < containerHeight;

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

			const { $props: props, $attrs: attrs } = this;
			let image = new Image();

			image.onload = e => this.handleLoad(e, image);
			image.onerror = e => this.handleError(e, image);

			Object.keys(attrs).forEach(key => image.setAttribute(key, attrs[key]));

			image.src = this.getImageSrc(props);
		},
		addLazyloadListener() {
			if (is.server) {
				return;
			}

			const { $el: el, $props: props } = this;
			const scrollContainer = props.scrollContainer;
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
			const { container, lazyloadHandler } = this;

			if (is.server || !container || !lazyloadHandler) {
				return;
			}

			this.container = null;
			this.lazyloadHandler = null;

			off(container, "scroll", lazyloadHandler);
		},
		handleLazyload() {
			const { $el: el, container } = this;

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
		const { $props: props } = this;

		if (props.lazyload) {
			this.addLazyloadListener();
		}
		else {
			this.loadImage();
		}
	},
	beforeDestroy() {
		const { $props: props } = this;

		props.lazyload && this.removeLazyloadListener();
	},
	render(h) {
		const { $slots: slots, $props: props, $attrs: attrs, state, $listeners: listeners, t: translate } = this;
		const center = !is.server && !isSupportObjectFit() && props.fit !== "fill";
		const viewable = is.array(props.viewer) && props.viewer.length > 0;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "image");
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
			const attributes = {
				class: classes.elImage,
				style: styles.elImage,
				attrs: {
					...attrs,
					src: this.getImageSrc(props),
					alt: props.alt
				},
				on: {
					...listeners
				}
			};

			children.push(
				<transition appear name={props.animation}>
					<img {...attributes} />
				</transition>
			);
		}

		return (
			<div class={classes.el}>{children}</div>
		);
	}
};

export default VuiImage;