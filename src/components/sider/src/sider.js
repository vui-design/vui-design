import VuiIcon from "vui-design/components/icon";
import getScrollBarSize from "vui-design/utils/getScrollBarSize";

if (typeof window !== "undefined") {
	const matchMediaPolyfill = mediaQuery => {
		return {
			media: mediaQuery,
			matches: false,
			addListener: function() {},
			removeListener: function() {}
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
		classNamePrefix: {
			type: String,
			default: "vui-sider"
		},
		theme: {
			type: String,
			default: "light",
			validator(value) {
				return ["light", "dark"].indexOf(value) > -1;
			}
		},
		breakpoint: {
			type: String,
			default: undefined,
			validator(value) {
				return ["xs", "sm", "md", "lg", "xl", "xxl"].indexOf(value) > -1;
			}
		},
		collapsible: {
			type: Boolean,
			default: false
		},
		collapsed: {
			type: Boolean,
			default: false
		},
		width: {
			type: [String, Number],
			default: 200
		},
		collapsedWidth: {
			type: [String, Number],
			default: 80
		},
		showTrigger: {
			type: Boolean,
			default: true
		}
	},

	data() {
		let matchMedia;
		let mediaQueryList = null;
		let matches = false;
		let defaultCollapsed = this.collapsed;

		if (typeof window !== "undefined") {
			matchMedia = window.matchMedia;
		}

		if (matchMedia && this.breakpoint && this.breakpoint in dimensions) {
			mediaQueryList = matchMedia(`(max-width: ${dimensions[this.breakpoint]})`);
		}

		return {
			mediaQueryList,
			matches,
			defaultCollapsed
		};
	},

	watch: {
		collapsed(value) {
			this.defaultCollapsed = value;
		},
		defaultCollapsed(value) {
			this.$emit("collapse", value);
		}
	},

	methods: {
		responsive() {
			this.matches = this.mediaQueryList.matches;
			this.defaultCollapsed = this.defaultCollapsed !== this.matches ? this.matches : this.defaultCollapsed;
		},
		toggle() {
			this.defaultCollapsed = !this.defaultCollapsed;
		},
		handleTriggerClick() {
			this.toggle();
		}
	},

	mounted() {
		if (this.mediaQueryList) {
			this.responsive();
			this.mediaQueryList.addListener(() => this.responsive());
		}
	},

	beforeDestroy() {
		if (this.mediaQueryList) {
			this.mediaQueryList.removeListener(() => this.responsive());
		}
	},

	render(h) {
		let { $slots, classNamePrefix, theme, collapsible, defaultCollapsed, showTrigger, matches, handleTriggerClick } = this;

		// width
		let width;

		if (defaultCollapsed) {
			width = this.collapsedWidth;
		}
		else {
			width = this.width;
		}

		// classes
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${theme}`]: theme
		};
		classes.elChildren = `${classNamePrefix}-children`;
		classes.elChildrenScrollbar = `${classNamePrefix}-children-scrollbar`;
		classes.elTrigger = `${classNamePrefix}-trigger`;

		// styles
		let styles = {};

		styles.el = {
			flex: `0 0 ${width}px`,
			width: `${width}px`,
			minWidth: `${width}px`,
			maxWidth: `${width}px`
		};
		styles.elChildrenScrollbar = {
			marginRight: `-${getScrollBarSize()}px`
		};

		// render
		let children = [];

		children.push(
			<div class={classes.elChildren}>
				<div class={classes.elChildrenScrollbar} style={styles.elChildrenScrollbar}>
					{$slots.default}
				</div>
			</div>
		);

		if ((collapsible || matches) && showTrigger) {
			children.push(
				<div class={classes.elTrigger} onClick={handleTriggerClick}>
					<VuiIcon type={defaultCollapsed ? "menu-unfold" : "menu-fold"} />
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