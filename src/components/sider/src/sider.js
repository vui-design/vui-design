import VuiIcon from "vui-design/components/icon";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import noop from "vui-design/utils/noop";
import getScrollbarSize from "vui-design/utils/getScrollbarSize";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

if (typeof window !== "undefined") {
	const matchMediaPolyfill = mediaQuery => {
		return {
			media: mediaQuery,
			matches: false,
			addListener: noop,
			removeListener: noop
		};
	};

	window.matchMedia = window.matchMedia || matchMediaPolyfill;
}

const dimensions = {
	xs: "480px",
	sm: "576px",
	md: "768px",
	lg: "992px",
	xl: "1200px",
	xl: "1600px"
};

const VuiSider = {
	name: "vui-sider",
	components: {
		VuiIcon
	},
	model: {
		prop: "collapsed",
		event: "collapse",
	},
	props: {
		classNamePrefix: PropTypes.string,
		theme: PropTypes.oneOf(["light", "dark"]).def("light"),
		breakpoint: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl", "xxl"]),
		width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(200),
		collapsible: PropTypes.bool.def(false),
		collapsed: PropTypes.bool.def(false),
		collapsedWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(80),
		showTrigger: PropTypes.bool.def(true),
		trigger: PropTypes.string
	},
	data() {
		const { $props: props } = this;
		let matchMedia;
		let mediaQueryList = null;

		if (typeof window !== "undefined") {
			matchMedia = window.matchMedia;
		}

		if (matchMedia && props.breakpoint && props.breakpoint in dimensions) {
			mediaQueryList = matchMedia("(max-width: " + dimensions[props.breakpoint] + ")");
		}

		const state = {
			mediaQueryList,
			matches: false,
			collapsed: props.collapsed
		};

		return {
			state
		};
	},
	watch: {
		collapsed(value) {
			this.state.collapsed = value;
		}
	},
	methods: {
		responsive() {
			this.state.matches = this.state.mediaQueryList.matches;
			this.state.collapsed = this.state.collapsed !== this.state.matches ? this.state.matches : this.state.collapsed;
			this.$emit("collapse", this.state.collapsed);
		},
		toggle() {
			this.state.collapsed = !this.state.collapsed;
			this.$emit("collapse", this.state.collapsed);
		},
		handleTriggerClick() {
			this.toggle();
		}
	},
	mounted() {
		if (this.state.mediaQueryList) {
			this.responsive();
			this.state.mediaQueryList.addListener(() => this.responsive());
		}
	},
	beforeDestroy() {
		if (this.state.mediaQueryList) {
			this.state.mediaQueryList.removeListener(() => this.responsive());
		}
	},
	render(h) {
		const { $slots: slots, $props: props, state, handleTriggerClick } = this;

		// width
		let width;

		if (state.collapsed) {
			width = is.string(props.collapsedWidth) ? props.collapsedWidth : `${props.collapsedWidth}px`;
		}
		else {
			width = is.string(props.width) ? props.width : `${props.width}px`;
		}

		// scrollbarSize
		const scrollbarSize = getScrollbarSize();

		// showTrigger
		const showTrigger = (props.collapsible || state.matches) && props.showTrigger;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "layout-sider");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.theme}`]: props.theme,
			[`${classNamePrefix}-with-trigger`]: showTrigger
		};
		classes.elChildren = `${classNamePrefix}-children`;
		classes.elChildrenScrollbar = `${classNamePrefix}-children-scrollbar`;
		classes.elTrigger = `${classNamePrefix}-trigger`;

		// style
		let styles = {};

		styles.el = {
			flex: `0 0 ${width}`,
			width: `${width}`,
			minWidth: `${width}`,
			maxWidth: `${width}`
		};
		styles.elChildrenScrollbar = {
			marginRight: `-${scrollbarSize}px`
		};

		// render
		let children = [];

		children.push(
			<div class={classes.elChildren}>
				<div class={classes.elChildrenScrollbar} style={styles.elChildrenScrollbar}>
					{slots.default}
				</div>
			</div>
		);

		if (showTrigger) {
			const iconType = state.collapsed ? "menu-unfold" : "menu-fold";

			children.push(
				<div class={classes.elTrigger} onClick={handleTriggerClick}>
					<VuiIcon type={iconType} />
				</div>
			);
		}

		return (
			<div class={classes.el} style={styles.el}>
				{children}
			</div>
		);
	}
};

export default VuiSider;