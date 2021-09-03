import VuiLazyRender from "../../lazy-render";
import Portal from "../../../directives/portal";
import Outclick from "../../../directives/outclick";
import Popup from "../../../libs/popup";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getStyle from "../../../utils/getStyle";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiDropdown = {
	name: "vui-dropdown",
	provide() {
		return {
			vuiDropdown: this
		};
	},
	components: {
		VuiLazyRender
	},
	directives: {
		Portal,
		Outclick
	},
	model: {
		prop: "visible",
		event: "change"
	},
	props: {
		classNamePrefix: PropTypes.string,
		trigger: PropTypes.oneOf(["hover", "click"]).def("hover"),
		visible: PropTypes.bool.def(false),
		disabled: PropTypes.bool.def(false),
		placement: PropTypes.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"]).def("bottom-start"),
		dropdownAutoWidth: PropTypes.bool.def(true),
		animation: PropTypes.string.def("vui-dropdown-body-scale"),
		getPopupContainer: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(() => document.body)
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
		open(eventType) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.timeout && clearTimeout(this.timeout);

			if (this.state.visible) {
				return;
			}

			this.state.visible = true;
			this.$emit("change", this.state.visible);
		},
		close(eventType) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			if (props.trigger === "click" && eventType === "hover") {
				return;
			}

			this.timeout && clearTimeout(this.timeout);

			const callback = () => {
				if (!this.state.visible) {
					return;
				}

				this.state.visible = false;
				this.$emit("change", this.state.visible);
			};

			if (eventType === "select") {
				callback();
			}
			else {
				this.timeout = setTimeout(callback, 100);
			}
		},
		register() {
			if (is.server || this.popup) {
				return;
			}

			const { $refs: references, $props: props } = this;
			const reference = references.trigger;
			const target = references.body;
			const settings = {
				placement: props.placement
			};

			if (!reference || !target || !settings.placement) {
				return;
			}

			let width = "";

			if (!props.dropdownAutoWidth) {
				width = getStyle(reference, "width");
			}

			this.popup = new Popup(reference, target, settings);
			this.popup.target.style.zIndex = Popup.nextZIndex();
			this.popup.target.style.width = width;
		},
		reregister() {
			if (is.server || !this.popup) {
				return;
			}

			this.popup.update();
		},
		unregister() {
			if (is.server || !this.popup) {
				return;
			}

			this.popup.destroy();
			this.popup = null;
		},
		handleMouseenter(e) {
			const { $props: props } = this;

			if (props.trigger === "hover") {
				this.open("hover");
			}
		},
		handleMouseleave(e) {
			const { $props: props } = this;

			if (props.trigger === "hover") {
				this.close("hover");
			}
		},
		handleClick(e) {
			const { $props: props, state } = this;

			if (props.trigger === "click") {
				state.visible ? this.close("click") : this.open("click");
			}
		},
		handleOutClick(e) {
			const { $props: props } = this;

			if (props.trigger === "click") {
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
			}
		},
		handleBeforeEnter() {
			this.$nextTick(() => this.register());
			this.$emit("beforeOpen");
		},
		handleEnter() {
			this.$emit("open");
		},
		handleAfterEnter() {
			this.$emit("afterOpen");
		},
		handleBeforeLeave() {
			this.$emit("beforeClose");
		},
		handleLeave() {
			this.$emit("close");
		},
		handleAfterLeave() {
			this.$nextTick(() => this.unregister());
			this.$emit("afterClose");
		}
	},
	render() {
		const { $slots: slots, $props: props, state } = this;
		const { handleMouseenter, handleMouseleave, handleClick, handleOutClick, handleBeforeEnter, handleEnter, handleAfterEnter, handleBeforeLeave, handleLeave, handleAfterLeave } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elTrigger = `${classNamePrefix}-trigger`;
		classes.elBody = `${classNamePrefix}-body`;

		// render
		return (
			<div class={classes.el} v-outclick={handleOutClick}>
				<div ref="trigger" class={classes.elTrigger} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave} onClick={handleClick}>
					{slots.default}
				</div>
				<VuiLazyRender status={state.visible}>
					<transition appear name={props.animation} onBeforeEnter={handleBeforeEnter} onAfterLeave={handleAfterLeave}>
						<div ref="body" v-portal={props.getPopupContainer} v-show={state.visible} class={classes.elBody} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave}>
							{slots.menu}
						</div>
					</transition>
				</VuiLazyRender>
			</div>
		);
	}
};

export default VuiDropdown;