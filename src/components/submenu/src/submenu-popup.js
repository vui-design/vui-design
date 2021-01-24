import Portal from "vui-design/directives/portal";
import Popup from "vui-design/utils/popup";
import is from "vui-design/utils/is";
import getStyle from "vui-design/utils/getStyle";

const VuiSubmenuPopup = {
	name: "vui-submenu-popup",

	directives: {
		Portal
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-submenu"
		},
		mode: {
			type: String,
			default: undefined
		},
		color: {
			type: String,
			default: undefined
		},
		level: {
			type: Number,
			default: undefined
		},
		indent: {
			type: Number,
			default: undefined
		},
		open: {
			type: Boolean,
			default: false
		},
		selected: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		animation: {
			type: String,
			default: undefined
		},
		getPopupContainer: {
			type: Function,
			default: () => document.body
		}
	},

	methods: {
		createPopup() {
			if (is.server) {
				return;
			}

			if (this.popup) {
				return;
			}

			let matchReferenceWidth = this.mode === "horizontal" && this.level === 1;
			let reference = this.$refs.header;
			let target = this.$refs.body;
			let settings = {
				placement:  matchReferenceWidth ? "bottom-start" : "right-start",
			};

			if (!matchReferenceWidth) {
				settings.modifiers = {
					offset: {
						offset: [0, -5]
					}
				};
			}

			if (!reference || !target || !settings.placement) {
				return;
			}

			this.popup = new Popup(reference, target, settings);
			this.popup.target.style.zIndex = Popup.nextZIndex();

			if (matchReferenceWidth) {
				this.popup.target.style.minWidth = parseFloat(getStyle(reference, "width")) + "px";
			}
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

		handleHeaderMouseenter(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("toggle", true, false);
		},
		handleHeaderMouseleave(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("toggle", false, false);
		},

		handleBodyMouseenter(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("toggle", true, true);
		},
		handleBodyMouseleave(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("toggle", false, true);
		},
		handleBodyBeforeEnter(el) {
			this.$nextTick(() => this.createPopup());
		},
		handleBodyEnter(el) {

		},
		handleBodyAfterEnter(el) {

		},
		handleBodyBeforeLeave(el) {

		},
		handleBodyLeave(el) {

		},
		handleBodyAfterLeave(el) {
			this.$nextTick(() => this.destroyPopup());
		}
	},

	render(h) {
		let { $slots, classNamePrefix, mode, color, level, indent, open, selected, disabled, animation, getPopupContainer } = this;
		let { handleHeaderMouseenter, handleHeaderMouseleave, handleBodyMouseenter, handleBodyMouseleave, handleBodyBeforeEnter, handleBodyEnter, handleBodyAfterEnter, handleBodyBeforeLeave, handleBodyLeave, handleBodyAfterLeave } = this;
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-open`]: open,
			[`${classNamePrefix}-selected`]: selected,
			[`${classNamePrefix}-disabled`]: disabled
		};
		let headerStyles = {};
		let portal = getPopupContainer();

		if (indent > 20) {
			headerStyles.paddingLeft = `${indent}px`;
		}

		return (
			<div class={classes}>
				<div ref="header" class={`${classNamePrefix}-header`} style={headerStyles} onMouseenter={handleHeaderMouseenter} onMouseleave={handleHeaderMouseleave}>
					{$slots.icon && <div class={`${classNamePrefix}-icon`}>{$slots.icon}</div>}
					{$slots.title && <div class={`${classNamePrefix}-title`}>{$slots.title}</div>}
					<i class={mode === "horizontal" && level === 1 ? `${classNamePrefix}-arrow-vertical` : `${classNamePrefix}-arrow-horizontal`}></i>
				</div>
				<transition
					name={animation}
					onBeforeEnter={handleBodyBeforeEnter}
					onEnter={handleBodyEnter}
					onAfterEnter={handleBodyAfterEnter}
					onBeforeLeave={handleBodyBeforeLeave}
					onLeave={handleBodyLeave}
					onAfterLeave={handleBodyAfterLeave}
					appear
				>
					<div ref="body" v-portal={portal} v-show={open} class={`${classNamePrefix}-body`} onMouseenter={handleBodyMouseenter} onMouseleave={handleBodyMouseleave}>
						{$slots.default}
					</div>
				</transition>
			</div>
		);
	}
};

export default VuiSubmenuPopup;