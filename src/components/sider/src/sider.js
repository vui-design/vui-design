import VuiIcon from "vui-design/components/icon";
import is from "vui-design/utils/is";
import getScrollBarSize from "vui-design/utils/getScrollBarSize";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

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
			default: undefined
		},
		theme: {
			type: String,
			default: "light",
			validator: value => ["light", "dark"].indexOf(value) > -1
		},
		breakpoint: {
			type: String,
			default: undefined,
			validator: value => ["xs", "sm", "md", "lg", "xl", "xxl"].indexOf(value) > -1
		},
		width: {
			type: [String, Number],
			default: 200
		},
		collapsible: {
			type: Boolean,
			default: false
		},
		collapsed: {
			type: Boolean,
			default: false
		},
		collapsedWidth: {
			type: [String, Number],
			default: 80
		},
		showTrigger: {
			type: Boolean,
			default: true
		},
		trigger: {
			type: String,
			default: undefined
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
		}
	},

	methods: {
		responsive() {
			this.matches = this.mediaQueryList.matches;
			this.defaultCollapsed = this.defaultCollapsed !== this.matches ? this.matches : this.defaultCollapsed;
			this.$emit("collapse", this.defaultCollapsed);
		},
		toggle() {
			this.defaultCollapsed = !this.defaultCollapsed;
			this.$emit("collapse", this.defaultCollapsed);
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
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, theme, collapsible, defaultCollapsed, showTrigger, matches, handleTriggerClick } = this;

		// width
		let width;

		if (defaultCollapsed) {
			width = is.string(this.collapsedWidth) ? this.collapsedWidth : `${this.collapsedWidth}px`;
		}
		else {
			width = is.string(this.width) ? this.width : `${this.width}px`;
		}

		// class
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "sider");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-with-trigger`]: showTrigger,
			[`${classNamePrefix}-${theme}`]: theme
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
			marginRight: `-${getScrollBarSize()}px`
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