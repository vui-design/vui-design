import VuiLazyRender from "vui-design/components/lazy-render";
import Portal from "vui-design/directives/portal";
import Popup from "vui-design/utils/popup";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const colors = ["dark", "light", "blue", "cyan", "geekblue", "gold", "green", "lime", "magenta", "orange", "pink", "purple", "red", "volcano", "yellow"];

const VuiTooltip = {
	name: "vui-tooltip",
	components: {
		VuiLazyRender
	},
	directives: {
		Portal
	},
	model: {
		prop: "visible",
		event: "input"
	},
	props: {
		classNamePrefix: PropTypes.string,
		visible: PropTypes.bool.def(false),
		color: PropTypes.string.def("dark"),
		content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		placement: PropTypes.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]).def("top"),
		animation: PropTypes.string.def("vui-tooltip-content-scale"),
		getPopupContainer: PropTypes.any.def(() => document.body)
	},
	data() {
		const { $props: props } = this;

		return {
			state: {
				visible: props.visible
			}
		};
	},
	watch: {
		visible(value) {
			this.state.visible = value;
		}
	},
	methods: {
		toggle(visible) {
			this.state.visible = visible;
			this.$emit("input", visible);
			this.$emit("change", visible);
		},
		createPopup() {
			if (is.server || this.popup) {
				return;
			}

			const { $refs: references, $props: props } = this;
			const reference = references.trigger;
			const target = references.content;
			const settings = {
				placement:  props.placement
			};

			if (!reference || !target || !settings.placement) {
				return;
			}

			this.popup = new Popup(reference, target, settings);
			this.popup.target.style.zIndex = Popup.nextZIndex();
		},
		destroyPopup() {
			if (is.server || !this.popup) {
				return;
			}

			this.popup.destroy();
			this.popup = null;
		},
		handleMouseenter() {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => this.toggle(true), 100);
		},
		handleMouseleave() {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => this.toggle(false), 100);
		},
		handleBeforeEnter(el) {
			this.$nextTick(() => this.createPopup());
		},
		handleAfterLeave(el) {
			this.$nextTick(() => this.destroyPopup());
		}
	},
	render() {
		const { $slots: slots, $props: props, state } = this;
		const { handleMouseenter, handleMouseleave, handleBeforeEnter, handleAfterLeave } = this;

		// color
		const withPresetColor = props.color && colors.indexOf(props.color) > -1;
		const withCustomColor = props.color && colors.indexOf(props.color) === -1;

		// maxWidth
		let maxWidth;

		if (props.maxWidth) {
			maxWidth = is.string(props.maxWidth) ? props.maxWidth : `${props.maxWidth}px`;
		}

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "tooltip");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elTrigger = `${classNamePrefix}-trigger`;
		classes.elContent = {
			[`${classNamePrefix}-content`]: true,
			[`${classNamePrefix}-content-${props.color}`]: withPresetColor
		};
		classes.elContentMain = `${classNamePrefix}-content-main`;
		classes.elContentArrow = `${classNamePrefix}-content-arrow`;

		// style
		let styles = {};

		styles.elContent = {
			maxWidth: maxWidth,
			backgroundColor: withCustomColor && props.color
		};
		styles.elContentMain = {
			color: withCustomColor &&`#fff`
		};
		styles.elContentArrow = {
			backgroundColor: withCustomColor && props.color
		};

		// render
		return (
			<div class={classes.el}>
				<div ref="trigger" class={classes.elTrigger} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave}>{slots.default}</div>
				<VuiLazyRender status={state.visible}>
					<transition appear name={props.animation} onBeforeEnter={handleBeforeEnter} onAfterLeave={handleAfterLeave}>
						<div ref="content" v-portal={props.getPopupContainer} v-show={state.visible} class={classes.elContent} style={styles.elContent} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave}>
							<div class={classes.elContentMain} style={styles.elContentMain}>{slots.content || props.content}</div>
							<div class={classes.elContentArrow} style={styles.elContentArrow}></div>
						</div>
					</transition>
				</VuiLazyRender>
			</div>
		);
	}
};

export default VuiTooltip;