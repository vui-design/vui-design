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
			type: String,
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
		return {
			defaultVisible: this.visible
		};
	},

	watch: {
		visible(value) {
			this.defaultVisible = value;
		}
	},

	methods: {
		createPopup() {
			if (is.server || this.popup) {
				return;
			}

			let reference = this.$refs.trigger;
			let target = this.$refs.content;
			let settings = {
				placement:  this.placement
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
				this.defaultVisible = true;
				this.$emit("change", this.defaultVisible);
			}, 100);
		},
		handleMouseLeave() {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => {
				this.defaultVisible = false;
				this.$emit("change", this.defaultVisible);
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
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, defaultVisible: visible, theme, content, placement, animation, getPopupContainer } = this;
		let { handleMouseEnter, handleMouseLeave, handleBeforeEnter, handleEnter, handleAfterEnter, handleBeforeLeave, handleLeave, handleAfterLeave } = this;
		let portal = getPopupContainer();

		// classes
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "tooltip");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elTrigger = `${classNamePrefix}-trigger`;
		classes.elContent = {
			[`${classNamePrefix}-content`]: true,
			[`${classNamePrefix}-content-${theme}`]: theme
		};
		classes.elArrow = `${classNamePrefix}-arrow`;

		// render
		return (
			<div class={classes.el}>
				<div
					ref="trigger"
					class={classes.elTrigger}
					onMouseenter={handleMouseEnter}
					onMouseleave={handleMouseLeave}
				>
					{slots.default}
				</div>
				<transition
					name={animation}
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
						v-show={visible}
						class={classes.elContent}
						onMouseenter={handleMouseEnter}
						onMouseleave={handleMouseLeave}
					>
						{slots.content || content}
						<i class={classes.elArrow}></i>
					</div>
				</transition>
			</div>
		);
	}
};

export default VuiTooltip;