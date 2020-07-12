import Portal from "vui-design/directives/portal";
import Popup from "vui-design/utils/popup";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiTooltip = {
	name: "vui-tooltip",

	directives: {
		Portal
	},

	model: {
		prop: "visible",
		event: "change"
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		visible: {
			type: Boolean,
			default: false
		},
		theme: {
			type: String,
			default: "dark",
			validator: value => ["light", "dark"].indexOf(value) > -1
		},
		content: {
			type: [String, Number],
			default: undefined
		},
		placement: {
			type: String,
			default: "top",
			validator: value => ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"].indexOf(value) > -1
		},
		animation: {
			type: String,
			default: "vui-tooltip-content-scale"
		},
		getPopupContainer: {
			type: Function,
			default: () => document.body
		}
	},

	data() {
		let { $props: props } = this;

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
		createPopup() {
			if (is.server || this.popup) {
				return;
			}

			let { $refs: refs, $props: props } = this;
			let reference = refs.trigger;
			let target = refs.content;
			let settings = {
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

		handleMouseEnter() {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				this.state.visible = true;
				this.$emit("change", true);
			}, 100);
		},
		handleMouseLeave() {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				this.state.visible = false;
				this.$emit("change", false);
			}, 100);
		},
		handleBeforeEnter(el) {
			this.$nextTick(() => this.createPopup());
		},
		handleEnter(el) {

		},
		handleAfterEnter(el) {

		},
		handleBeforeLeave(el) {

		},
		handleLeave(el) {

		},
		handleAfterLeave(el) {
			this.$nextTick(() => this.destroyPopup());
		}
	},

	render() {
		let { $slots: slots, $props: props, state } = this;
		let { handleMouseEnter, handleMouseLeave, handleBeforeEnter, handleEnter, handleAfterEnter, handleBeforeLeave, handleLeave, handleAfterLeave } = this;
		let portal = props.getPopupContainer();

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "tooltip");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elTrigger = `${classNamePrefix}-trigger`;
		classes.elContent = {
			[`${classNamePrefix}-content`]: true,
			[`${classNamePrefix}-content-${props.theme}`]: props.theme
		};
		classes.elArrow = `${classNamePrefix}-arrow`;

		// render
		return (
			<div class={classes.el}>
				<div ref="trigger" class={classes.elTrigger} onMouseenter={handleMouseEnter} onMouseleave={handleMouseLeave}>{slots.default}</div>
				<transition
					name={props.animation}
					onBeforeEnter={handleBeforeEnter}
					onEnter={handleEnter}
					onAfterEnter={handleAfterEnter}
					onBeforeLeave={handleBeforeLeave}
					onLeave={handleLeave}
					onAfterLeave={handleAfterLeave}
					appear
				>
					<div
						ref="content"
						v-portal={portal}
						v-show={state.visible}
						class={classes.elContent}
						onMouseenter={handleMouseEnter}
						onMouseleave={handleMouseLeave}
					>
						{slots.content || props.content}
						<i class={classes.elArrow}></i>
					</div>
				</transition>
			</div>
		);
	}
};

export default VuiTooltip;