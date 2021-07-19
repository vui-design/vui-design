import VuiLazyRender from "vui-design/components/lazy-render";
import VuiIcon from "vui-design/components/icon";
import Portal from "vui-design/directives/portal";
import Popup from "vui-design/utils/popup";
import PropTypes from "vui-design/utils/prop-types";
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
		VuiLazyRender,
		VuiIcon
	},
	directives: {
		Portal
	},
	props: {
		classNamePrefix: PropTypes.string,
		name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(() => guid()),
		icon: PropTypes.string,
		title: PropTypes.string,
		disabled: PropTypes.bool.def(false),
		animation: PropTypes.string.def("vui-dropdown-submenu-body-scale"),
		getPopupContainer: PropTypes.func.def(() => document.body)
	},
	data() {
		const state = {
			visible: false
		};

		return {
			state
		};
	},
	methods: {
		open(eventType, forceOpenParent) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.timeout && clearTimeout(this.timeout);
			this.state.visible = true;

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
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.timeout && clearTimeout(this.timeout);

			const callback = () => {
				this.state.visible = false;
			};

			if (eventType === "select") {
				callback();
			}
			else {
				this.timeout = setTimeout(callback, 100);
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
		register() {
			if (is.server || this.popup) {
				return;
			}

			const { $refs: references, $props: props } = this;
			const reference = references.header;
			const target = references.body;
			const settings = {
				placement: "right-start",
				modifiers: {
					offset: {
						offset: [0, -4]
					}
				}
			};

			if (!reference || !target || !settings.placement) {
				return;
			}

			this.popup = new Popup(reference, target, settings);
			this.popup.target.style.zIndex = Popup.nextZIndex();
		},
		unregister() {
			if (is.server || !this.popup) {
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
			this.$nextTick(() => this.register());
		},
		handleBodyAfterLeave(el) {
			this.$nextTick(() => this.unregister());
		},
	},
	render(h) {
		const { vuiDropdownMenu, $slots: slots, $props: props, state } = this;
		const { $props: vuiDropdownMenuProps } = vuiDropdownMenu;
		const { handleHeaderMouseenter, handleHeaderMouseleave, handleBodyMouseenter, handleBodyMouseleave, handleBodyBeforeEnter, handleBodyAfterLeave } = this;

		// icon
		let icon;

		if (slots.icon) {
			icon = slots.icon;
		}
		else if (props.icon) {
			icon = (
				<VuiIcon type={props.icon} />
			);
		}

		// title
		const title = slots.title || props.title;

		// class
		const classNamePrefix = getClassNamePrefix(props.lassNamePrefix, "dropdown-submenu");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-open`]: state.visible,
			[`${classNamePrefix}-disabled`]: props.disabled
		};
		classes.elHeader = `${classNamePrefix}-header`;
		classes.elIcon = `${classNamePrefix}-icon`;
		classes.elTitle = `${classNamePrefix}-title`;
		classes.elArrow = `${classNamePrefix}-arrow`;
		classes.elBody = `${classNamePrefix}-body`;

		const menuClassNamePrefix = getClassNamePrefix(vuiDropdownMenuProps.classNamePrefix, "dropdown-menu");
		const menuColor = vuiDropdownMenuProps.color;

		classes.elMenu = {
			[`${menuClassNamePrefix}`]: true,
			[`${menuClassNamePrefix}-popup`]: true,
			[`${menuClassNamePrefix}-${menuColor}`]: menuColor
		};

		// render
		return (
			<div class={classes.el}>
				<div ref="header" class={classes.elHeader} onMouseenter={handleHeaderMouseenter} onMouseleave={handleHeaderMouseleave}>
					{icon && <div class={classes.elIcon}>{icon}</div>}
					{title && <div class={classes.elTitle}>{title}</div>}
					<i class={classes.elArrow}></i>
				</div>
				<VuiLazyRender status={state.visible}>
					<transition appear name={props.animation} onBeforeEnter={handleBodyBeforeEnter} onAfterLeave={handleBodyAfterLeave}>
						<div ref="body" v-portal={props.getPopupContainer} v-show={state.visible} class={classes.elBody} onMouseenter={handleBodyMouseenter} onMouseleave={handleBodyMouseleave}>
							<div class={classes.elMenu}>{slots.default}</div>
						</div>
					</transition>
				</VuiLazyRender>
			</div>
		);
	}
};

export default VuiDropdownSubmenu;