import Outclick from "vui-design/directives/outclick";
import Portal from "vui-design/directives/portal";
import Popup from "vui-design/utils/popup";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiDropdown = {
	name: "vui-dropdown",

	provide() {
		return {
			vuiDropdown: this
		};
	},

	directives: {
		Outclick,
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
		trigger: {
			type: String,
			default: "hover",
			validator: value => ["hover", "click"].indexOf(value) > -1
		},
		visible: {
			type: Boolean,
			default: false
		},
		placement: {
			type: String,
			default: "bottom-start",
			validator: value => ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"].indexOf(value) > -1
		},
		animation: {
			type: String,
			default: "vui-dropdown-body-scale"
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
		open(eventType) {
			if (this.disabled) {
				return;
			}

			this.timeout && clearTimeout(this.timeout);

			this.defaultVisible = true;
			this.$emit("change", this.defaultVisible);
		},
		close(eventType) {
			if (this.disabled) {
				return;
			}

			if (this.trigger === "click" && eventType === "hover") {
				return;
			}

			this.timeout && clearTimeout(this.timeout);

			const close = () => {
				this.defaultVisible = false;
				this.$emit("change", this.defaultVisible);
			};

			if (eventType === "select") {
				close();
			}
			else {
				this.timeout = setTimeout(close, 100);
			}
		},

		createPopup() {
			if (is.server) {
				return;
			}

			if (this.popup) {
				return;
			}

			let reference = this.$refs.trigger;
			let target = this.$refs.body;
			let settings = {
				placement: this.placement
			};

			if (!reference || !target || !settings.placement) {
				return;
			}

			this.popup = new Popup(reference, target, settings);
			this.popup.target.style.zIndex = Popup.nextZIndex();
		},
		destroyPopup() {
			if (is.server) {
				return;
			}

			if (!this.popup) {
				return;
			}

			this.popup.destroy();
			this.popup = null;
		},

		handleMouseEnter() {
			if (this.trigger !== "hover") {
				return;
			}

			this.open("hover");
		},
		handleMouseLeave() {
			if (this.trigger !== "hover") {
				return;
			}

			this.close("hover");
		},
		handleClick() {
			if (this.trigger !== "click") {
				return;
			}

			this.defaultVisible ? this.close("click") : this.open("click");
		},
		handleOutClick(e) {
			const isChildElement = function(component, targetElement) {
				return component.$children.some(child => {
					if (child.$el === targetElement || child.$el.contains(targetElement) || (child.$refs && child.$refs.body && (child.$refs.body === targetElement || child.$refs.body.contains(targetElement)))) {
						return true;
					}
					else if (child.$children && isChildElement(child, targetElement)) {
						return true;
					}

					return false;
				});
			};

			if (isChildElement(this, e.target)) {
				return;
			}

			this.close("click");
		},

		handleBeforeEnter(el) {
			this.$nextTick(() => this.createPopup());
		},
		handleAfterLeave(el) {
			this.$nextTick(() => this.destroyPopup());
		}
	},

	render() {
		const { $slots: slots, classNamePrefix: customizedClassNamePrefix, defaultVisible, menu, placement, animation, getPopupContainer } = this;
		const { handleMouseEnter, handleMouseLeave, handleClick, handleOutClick, handleBeforeEnter, handleAfterLeave } = this;
		const portal = getPopupContainer();

		const classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "dropdown");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elTrigger = `${classNamePrefix}-trigger`;
		classes.elBody = `${classNamePrefix}-body`;

		return (
			<div v-outclick={handleOutClick} class={classes.el}>
				<div ref="trigger" class={classes.elTrigger} onMouseenter={handleMouseEnter} onMouseleave={handleMouseLeave} onClick={handleClick}>{slots.default}</div>
				<transition name={animation} onBeforeEnter={handleBeforeEnter} onAfterLeave={handleAfterLeave} appear>
					<div ref="body" v-portal={portal} v-show={defaultVisible} class={classes.elBody} onMouseenter={handleMouseEnter} onMouseleave={handleMouseLeave}>{slots.menu}</div>
				</transition>
			</div>
		);
	}
};

export default VuiDropdown;