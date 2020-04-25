import VuiIcon from "vui-design/components/icon";
import Portal from "vui-design/directives/portal";
import Popup from "vui-design/utils/popup";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiDropdownSubmenu = {
	name: "vui-dropdown-submenu",

	provide() {
		return {
			vuiDropdownSubmenu: this
		};
	},

	inject: {
		vuiDropdown: {
			default: undefined
		},
		vuiDropdownMenu: {
			default: undefined
		},
		vuiDropdownSubmenu: {
			default: undefined
		}
	},

	components: {
		VuiIcon
	},

	directives: {
		Portal
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		name: {
			type: [String, Number],
			default: () => guid()
		},
		icon: {
			type: String,
			default: undefined
		},
		title: {
			type: String,
			default: undefined
		},
		disabled: {
			type: Boolean,
			default: false
		},
		animation: {
			type: String,
			default: "vui-dropdown-submenu-body-scale"
		},
		getPopupContainer: {
			type: Function,
			default: () => document.body
		}
	},

	data() {
		return {
			visible: false
		};
	},

	methods: {
		open(eventType, forceOpenParent) {
			if (this.disabled) {
				return;
			}

			this.timeout && clearTimeout(this.timeout);

			this.visible = true;

			if (forceOpenParent) {
				if (this.vuiDropdownSubmenu) {
					this.vuiDropdownSubmenu.open(eventType, forceOpenParent);
				}
				else if (this.vuiDropdown) {
					this.vuiDropdown.open(eventType);
				}
			}
		},
		close(eventType, forceCloseParent) {
			if (this.disabled) {
				return;
			}

			this.timeout && clearTimeout(this.timeout);

			const close = () => {
				this.visible = false;
			};

			if (eventType === "select") {
				close();
			}
			else {
				this.timeout = setTimeout(close, 100);
			}

			if (forceCloseParent) {
				if (this.vuiDropdownSubmenu) {
					this.vuiDropdownSubmenu.close(eventType, forceCloseParent);
				}
				else if (this.vuiDropdown) {
					this.vuiDropdown.close(eventType);
				}
			}
		},

		createPopup() {
			if (is.server) {
				return;
			}

			if (this.popup) {
				return;
			}

			let reference = this.$refs.header;
			let target = this.$refs.body;
			let settings = {
				placement: "right-start",
				modifiers: {
					offset: {
						offset: [0, -5]
					}
				}
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

		handleHeaderMouseenter(e) {
			this.open("hover", false);
		},
		handleHeaderMouseleave(e) {
			this.close("hover", false);
		},

		handleBodyMouseenter(e) {
			this.open("hover", true);
		},
		handleBodyMouseleave(e) {
			this.close("hover", true);
		},

		handleBodyBeforeEnter(el) {
			this.$nextTick(() => this.createPopup());
		},
		handleBodyAfterLeave(el) {
			this.$nextTick(() => this.destroyPopup());
		},
	},

	render(h) {
		const { vuiDropdownMenu, $slots: slots, classNamePrefix: customizedClassNamePrefix, visible, disabled, animation, getPopupContainer } = this;
		const { handleHeaderMouseenter, handleHeaderMouseleave, handleBodyMouseenter, handleBodyMouseleave, handleBodyBeforeEnter, handleBodyAfterLeave } = this;
		const portal = getPopupContainer();

		let icon;

		if (slots.icon) {
			icon = slots.icon;
		}
		else if (this.icon) {
			icon = (
				<VuiIcon type={this.icon} />
			);
		}

		let title = slots.title || this.title;

		const menuClassNamePrefix = getClassNamePrefix(vuiDropdownMenu.classNamePrefix, "dropdown-menu");
		const menuTheme = vuiDropdownMenu.theme;
		const classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "dropdown-submenu");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-open`]: visible,
			[`${classNamePrefix}-disabled`]: disabled
		};
		classes.elHeader = `${classNamePrefix}-header`;
		classes.elIcon = `${classNamePrefix}-icon`;
		classes.elTitle = `${classNamePrefix}-title`;
		classes.elArrow = `${classNamePrefix}-arrow`;
		classes.elBody = `${classNamePrefix}-body`;
		classes.elMenu = {
			[`${menuClassNamePrefix}`]: true,
			[`${menuClassNamePrefix}-popup`]: true,
			[`${menuClassNamePrefix}-${menuTheme}`]: menuTheme
		};

		return (
			<div class={classes.el}>
				<div ref="header" class={classes.elHeader} onMouseenter={handleHeaderMouseenter} onMouseleave={handleHeaderMouseleave}>
					{icon && <div class={classes.elIcon}>{icon}</div>}
					{title && <div class={classes.elTitle}>{title}</div>}
					<i class={classes.elArrow}></i>
				</div>
				<transition appear name={animation} onBeforeEnter={handleBodyBeforeEnter} onAfterLeave={handleBodyAfterLeave}>
					<div ref="body" v-portal={portal} v-show={visible} class={classes.elBody} onMouseenter={handleBodyMouseenter} onMouseleave={handleBodyMouseleave}>
						<div class={classes.elMenu}>{slots.default}</div>
					</div>
				</transition>
			</div>
		);
	}
};

export default VuiDropdownSubmenu;