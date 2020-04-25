import Portal from "vui-design/directives/portal";
import Outclick from "vui-design/directives/outclick";
import Popup from "vui-design/utils/popup";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiPopover = {
	name: "vui-popover",

	directives: {
		Portal,
		Outclick
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
		trigger: {
			type: String,
			default: "hover",
			validator: value => ["hover", "focus", "click"].indexOf(value) > -1
		},
		visible: {
			type: Boolean,
			default: false
		},
		title: {
			type: String,
			default: undefined
		},
		content: {
			type: String,
			default: undefined
		},
		minWidth: {
			type: [Number, String],
			default: 150
		},
		maxWidth: {
			type: [Number, String],
			default: undefined
		},
		placement: {
			type: String,
			default: "top",
			validator: value => /^(top|bottom|left|right)(-start|-end)?$/g.test(value)
		},
		animation: {
			type: String,
			default: "vui-popover-popup-scale"
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

			let reference = this.$refs.reference;
			let target = this.$refs.target;
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

		handleMouseEnter(e) {
			if (this.trigger !== "hover") {
				return;
			}

			if (this.timeout) {
				clearTimeout(this.timeout);
			}

			this.timeout = setTimeout(() => {
				this.defaultVisible = true;
				this.$emit("change", this.defaultVisible);
			}, 150);
		},
		handleMouseLeave(e) {
			if (this.trigger !== "hover") {
				return;
			}

			if (this.timeout) {
				clearTimeout(this.timeout);
			}

			this.timeout = setTimeout(() => {
				this.defaultVisible = false;
				this.$emit("change", this.defaultVisible);
			}, 150);
		},
		handleFocusin() {
			if (this.trigger !== "focus") {
				return;
			}

			this.defaultVisible = true;
			this.$emit("change", this.defaultVisible);
		},
		handleFocusout() {
			if (this.trigger !== "focus") {
				return;
			}

			this.defaultVisible = false;
			this.$emit("change", this.defaultVisible);
		},
		handleClick(e) {
			if (this.trigger !== "click") {
				return;
			}

			this.defaultVisible = !this.defaultVisible;
			this.$emit("change", this.defaultVisible);
		},
		handleOutClick(e) {
			if (this.trigger !== "click") {
				return;
			}

			let { $refs: refs } = this;

			if (e.target === refs.target || refs.target.contains(e.target)) {
				return;
			}

			this.defaultVisible = false;
			this.$emit("change", this.defaultVisible);
		},
		handleBeforeEnter(el) {
			this.$nextTick(() => this.createPopup());
		},
		handleAfterLeave(el) {
			this.$nextTick(() => this.destroyPopup());
		}
	},

	render() {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, defaultVisible: visible, title, content, minWidth, maxWidth, placement, animation, getPopupContainer } = this;
		let { handleMouseEnter, handleMouseLeave, handleFocusin, handleFocusout, handleClick, handleOutClick, handleBeforeEnter, handleAfterLeave } = this;
		let portal = getPopupContainer();

		// classes
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "popover");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elTrigger = `${classNamePrefix}-trigger`;
		classes.elPopup = `${classNamePrefix}-popup`;
		classes.elPopupHeader = `${classNamePrefix}-popup-header`;
		classes.elPopupBody = `${classNamePrefix}-popup-body`;
		classes.elPopupArrow = `${classNamePrefix}-popup-arrow`;

		// styles
		let styles = {};

		styles.elPopup = {};

		if (minWidth) {
			styles.elPopup.minWidth = is.string(minWidth) ? minWidth : `${minWidth}px`;
		}

		if (maxWidth) {
			styles.elPopup.maxWidth = is.string(maxWidth) ? maxWidth : `${maxWidth}px`;
		}

		// render
		title = slots.title || title;
		content = slots.content || content;

		return (
			<div class={classes.el}>
				<div
					ref="reference"
					class={classes.elTrigger}
					onMouseenter={handleMouseEnter}
					onMouseleave={handleMouseLeave}
					onFocusin={handleFocusin}
					onFocusout={handleFocusout}
					onClick={handleClick}
					v-outclick={handleOutClick}
				>
					{slots.default}
				</div>
				<transition
					name={animation}
					onBeforeEnter={handleBeforeEnter}
					onAfterLeave={handleAfterLeave}
					appear
				>
					<div
						ref="target"
						v-portal={portal}
						v-show={visible}
						class={classes.elPopup}
						style={styles.elPopup}
						onMouseenter={handleMouseEnter}
						onMouseleave={handleMouseLeave}
					>
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
			</div>
		);
	}
};

export default VuiPopover;