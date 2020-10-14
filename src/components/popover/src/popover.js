import VuiLazyRender from "vui-design/components/lazy-render";
import Portal from "vui-design/directives/portal";
import Outclick from "vui-design/directives/outclick";
import Popup from "vui-design/utils/popup";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getEventTarget from "vui-design/utils/getEventTarget";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiPopover = {
	name: "vui-popover",
	components: {
		VuiLazyRender
	},
	directives: {
		Portal,
		Outclick
	},
	model: {
		prop: "visible",
		event: "input"
	},
	props: {
		classNamePrefix: PropTypes.string,
		trigger: PropTypes.oneOf(["hover", "focus", "click"]).def("hover"),
		visible: PropTypes.bool.def(false),
		title: PropTypes.string,
		content: PropTypes.string,
		minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(150),
		maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		placement: PropTypes.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]).def("top"),
		animation: PropTypes.string.def("vui-popover-popup-scale"),
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
			const target = references.popup;
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
		handleMouseEnter(e) {
			const { $props: props } = this;

			if (props.trigger !== "hover") {
				return;
			}

			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => this.toggle(true), 100);
		},
		handleMouseLeave(e) {
			const { $props: props } = this;

			if (props.trigger !== "hover") {
				return;
			}

			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => this.toggle(false), 100);
		},
		handleFocusin() {
			const { $props: props } = this;

			if (props.trigger !== "focus") {
				return;
			}

			this.toggle(true);
		},
		handleFocusout() {
			const { $props: props } = this;

			if (props.trigger !== "focus") {
				return;
			}

			this.toggle(false);
		},
		handleClick(e) {
			const { $props: props, state } = this;

			if (props.trigger !== "click") {
				return;
			}

			this.toggle(!state.visible);
		},
		handleOutClick(e) {
			const { $props: props } = this;

			if (props.trigger !== "click") {
				return;
			}

			const { $refs: references } = this;
			const target = getEventTarget(e);

			if (!target || !references.popup || target === references.popup || references.popup.contains(target)) {
				return;
			}

			this.toggle(false);
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
		const { handleMouseEnter, handleMouseLeave, handleFocusin, handleFocusout, handleClick, handleOutClick, handleBeforeEnter, handleAfterLeave } = this;

		// title
		const title = slots.title || props.title;

		// content
		const content = slots.content || props.content;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "popover");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elTrigger = `${classNamePrefix}-trigger`;
		classes.elPopup = `${classNamePrefix}-popup`;
		classes.elPopupHeader = `${classNamePrefix}-popup-header`;
		classes.elPopupBody = `${classNamePrefix}-popup-body`;
		classes.elPopupArrow = `${classNamePrefix}-popup-arrow`;

		// style
		let styles = {};

		styles.elPopup = {};

		if (props.minWidth) {
			styles.elPopup.minWidth = is.string(props.minWidth) ? props.minWidth : `${props.minWidth}px`;
		}

		if (props.maxWidth) {
			styles.elPopup.maxWidth = is.string(props.maxWidth) ? props.maxWidth : `${props.maxWidth}px`;
		}

		// render
		return (
			<div class={classes.el}>
				<div ref="trigger" class={classes.elTrigger} onMouseenter={handleMouseEnter} onMouseleave={handleMouseLeave} onFocusin={handleFocusin} onFocusout={handleFocusout} onClick={handleClick} v-outclick={handleOutClick}>
					{slots.default}
				</div>
				<VuiLazyRender status={state.visible}>
					<transition appear name={props.animation} onBeforeEnter={handleBeforeEnter} onAfterLeave={handleAfterLeave}>
						<div ref="popup" v-portal={props.getPopupContainer} v-show={state.visible} class={classes.elPopup} style={styles.elPopup} onMouseenter={handleMouseEnter} onMouseleave={handleMouseLeave}>
							{
								title && (
									<div class={classes.elPopupHeader}>{title}</div>
								)
							}
							{
								content && (
									<div class={classes.elPopupBody}>{content}</div>
								)
							}
							<div class={classes.elPopupArrow}></div>
						</div>
					</transition>
				</VuiLazyRender>
			</div>
		);
	}
};

export default VuiPopover;