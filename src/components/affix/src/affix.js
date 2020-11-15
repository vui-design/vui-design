import VuiResizeObserver from "vui-design/components/resize-observer";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import requestAnimationFrameThrottle from "vui-design/utils/requestAnimationFrameThrottle";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import { getElementRect, getFixedTop, getFixedBottom, addObserver,  removeObserver } from "./utils";

const VuiAffix = {
	name: "vui-affix",
	components: {
		VuiResizeObserver
	},
	props: {
		classNamePrefix: PropTypes.string,
		getScrollContainer: PropTypes.func.def(() => typeof window === "undefined" ? null : window),
		offsetTop: PropTypes.number,
		offsetBottom: PropTypes.number
	},
	data() {
		const state = {
			scrollContainer: null,
			status: "none",
			affixed: false,
			styleAffix: undefined,
			stylePlaceholder: undefined
		};

		return {
			state
		};
	},
	watch: {
		getScrollContainer(value) {
			let scrollContainer = null;

			if (value) {
				scrollContainer = value() || null;
			}

			if (this.state.scrollContainer !== scrollContainer) {
				removeObserver(this);

				if (scrollContainer) {
					addObserver(scrollContainer, this);
					this.onUpdatePosition();
				}

				this.state.scrollContainer = scrollContainer;
			}
		},
		offsetTop() {
			this.onUpdatePosition();
		},
		offsetBottom() {
			this.onUpdatePosition();
		}
	},
	methods: {
		getOffsetTop() {
			const { $props: props } = this;

			if (is.undefined(props.offsetTop) && is.undefined(props.offsetBottom)) {
				return 0;
			}

			return props.offsetTop;
		},
		getOffsetBottom() {
			const { $props: props } = this;

			return props.offsetBottom;
		},
		prepare() {
			this.state.status = "prepare";
			this.state.styleAffix = undefined;
			this.state.stylePlaceholder = undefined;
			this.$forceUpdate();
		},
		measure() {
			const { $refs: references, $props: props, state } = this;

			if (state.status !== "prepare" || !references.affix || !references.placeholder || !props.getScrollContainer) {
				return;
			}

			const scrollContainer = props.getScrollContainer();
			const offsetTop = this.getOffsetTop();
			const offsetBottom = this.getOffsetBottom();

			if (!scrollContainer) {
				return;
			}

			const rect = {};

			rect.scrollContainer = getElementRect(scrollContainer);
			rect.placeholder = getElementRect(references.placeholder);

			const top = getFixedTop(rect.placeholder, rect.scrollContainer, offsetTop);
			const bottom = getFixedBottom(rect.placeholder, rect.scrollContainer, offsetBottom);
			const newState = {};

			if (!is.undefined(top)) {
				newState.styleAffix = {
					position: "fixed",
					top: top,
					width: rect.placeholder.width + "px",
					height: rect.placeholder.height + "px"
				};
				newState.stylePlaceholder = {
					width: rect.placeholder.width + "px",
					height: rect.placeholder.height + "px"
				};
			}
			else if (!is.undefined(bottom)) {
				newState.styleAffix = {
					position: "fixed",
					bottom: bottom,
					width: rect.placeholder.width + "px",
					height: rect.placeholder.height + "px"
				};
				newState.stylePlaceholder = {
					width: rect.placeholder.width + "px",
					height: rect.placeholder.height + "px"
				};
			}

			newState.status = "none";
			newState.affixed = !!newState.styleAffix;

			if (state.affixed !== newState.affixed) {
				this.$emit("change", newState.affixed);
			}

			this.state.status = newState.status;
			this.state.affixed = newState.affixed;
			this.state.styleAffix = newState.styleAffix;
			this.state.stylePlaceholder = newState.stylePlaceholder;
		},
		onUpdatePosition() {
			this.prepare();
		},
		onLazyUpdatePosition() {
			const { $refs: references, $props: props, state } = this;

			if (props.getScrollContainer && state.styleAffix) {
				const scrollContainer = props.getScrollContainer();
				const offsetTop = this.getOffsetTop();
				const offsetBottom = this.getOffsetBottom();

				if (scrollContainer && references.placeholder) {
					const rect = {};

					rect.scrollContainer = getElementRect(scrollContainer);
					rect.placeholder = getElementRect(references.placeholder);

					const top = getFixedTop(rect.placeholder, rect.scrollContainer, offsetTop);
					const bottom = getFixedBottom(rect.placeholder, rect.scrollContainer, offsetBottom);

					if ((!is.undefined(top) && state.styleAffix.top === top) || (!is.undefined(bottom) && state.styleAffix.bottom === bottom)) {
						return;
					}
				}
			}

			this.prepare();
		}
	},
	beforeMount() {
		this.onUpdatePosition = requestAnimationFrameThrottle(this.onUpdatePosition);
		this.onLazyUpdatePosition = requestAnimationFrameThrottle(this.onLazyUpdatePosition);
	},
	mounted() {
		const { $props: props } = this;

		if (props.getScrollContainer) {
			const callback = () => {
				const scrollContainer = props.getScrollContainer();

				addObserver(scrollContainer, this);
				this.onUpdatePosition();
			};

			this.timeout = setTimeout(callback);
		}
	},
	updated() {
		this.measure();
	},
	beforeDestroy() {
		clearTimeout(this.timeout);
		removeObserver(this);
		this.onUpdatePosition.cancel();
		this.onLazyUpdatePosition.cancel();
	},
	render() {
		const { $slots: slots, $props: props, state } = this;
		const handleResize = () => this.onUpdatePosition();

		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "affix");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: state.styleAffix
		};

		return (
			<VuiResizeObserver onResize={handleResize}>
				<div ref="placeholder" style={state.stylePlaceholder}>
					<div ref="affix" class={classes.el} style={state.styleAffix}>{slots.default}</div>
				</div>
			</VuiResizeObserver>
		);
	}
};

export default VuiAffix;