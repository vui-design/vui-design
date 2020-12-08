import VuiLazyRender from "vui-design/components/lazy-render";
import VuiIcon from "vui-design/components/icon";
import VuiButton from "vui-design/components/button";
import Portal from "vui-design/directives/portal";
import Locale from "vui-design/mixins/locale";
import Popup from "vui-design/utils/popup";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import merge from "vui-design/utils/merge";
import css from "vui-design/utils/css";
import styleToObject from "vui-design/utils/styleToObject";
import addScrollbarEffect from "vui-design/utils/addScrollbarEffect";
import getStyle from "vui-design/utils/getStyle";
import getElementByEvent from "vui-design/utils/getElementByEvent";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiDrawer = {
	name: "vui-drawer",
	provide() {
		return {
			vuiDrawer: this
		};
	},
	inject: {
		vuiDrawer: {
			default: undefined
		}
	},
	components: {
		VuiLazyRender,
		VuiIcon,
		VuiButton
	},
	directives: {
		Portal
	},
	mixins: [
		Locale
	],
	model: {
		prop: "visible",
		event: "input"
	},
	props: {
		classNamePrefix: PropTypes.string,
		visible: PropTypes.bool.def(false),
		title: PropTypes.string,
		showFooter: PropTypes.bool.def(true),
		showCancelButton: PropTypes.bool.def(true),
		cancelButtonProps: PropTypes.object,
		cancelText: PropTypes.string,
		cancelAsync: PropTypes.bool.def(false),
		showOkButton: PropTypes.bool.def(true),
		okButtonProps: PropTypes.object,
		okText: PropTypes.string,
		okAsync: PropTypes.bool.def(false),
		closable: PropTypes.bool.def(true),
		placement: PropTypes.oneOf(["top", "bottom", "left", "right"]).def("right"),
		width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(500),
		height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(500),
		className: PropTypes.string,
		headerStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		bodyStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		footerStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		backdrop: PropTypes.bool.def(true),
		backdropClassName: PropTypes.string,
		backdropStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		clickBackdropToClose: PropTypes.bool.def(true),
		animations: PropTypes.array.def(["vui-drawer-backdrop-fade", "vui-drawer-slide"]),
		getPopupContainer: PropTypes.any.def(() => document.body)
	},
	data() {
		const { $props: props } = this;

		return {
			state: {
				visible: props.visible,
				zIndex: Popup.nextZIndex(),
				cancelLoading: false,
				okLoading: false
			}
		};
	},
	watch: {
		visible(value) {
			if (this.state.visible === value) {
				return;
			}

			this.state.visible = value;

			if (!value) {
				return;
			}

			this.state.zIndex = Popup.nextZIndex();
		}
	},
	methods: {
		toggle(visible) {
			this.state.visible = visible;
			this.$emit("input", visible);
			this.$emit("change", visible);
		},
		open() {
			this.toggle(true);
		},
		close() {
			this.toggle(false);
		},
		push() {
			const { vuiDrawer, $refs: references, $props: props } = this;
			const drawer = references.drawer;
			const placement = props.placement;
			const distance = parseInt(getStyle(drawer, placement)) + 200;

			css(drawer, placement, distance + "px");

			vuiDrawer && vuiDrawer.push();
		},
		pull() {
			const { vuiDrawer, $refs: references, $props: props } = this;
			const drawer = references.drawer;
			const placement = props.placement;
			const distance = parseInt(getStyle(drawer, placement)) - 200;

			css(drawer, placement, distance + "px");

			vuiDrawer && vuiDrawer.pull();
		},
		handleBackdropClick() {
			const { $props: props } = this;

			if (!props.backdrop || !props.clickBackdropToClose) {
				return;
			}

			this.handleCancel();
		},
		handleWrapperClick(e) {
			const { $refs: references } = this;
			const target = getElementByEvent(e);

			if (!target || !references.wrapper || target !== references.wrapper) {
				return;
			}

			this.handleBackdropClick();
		},
		handleCancel() {
			const { $props: props } = this;

			if (props.cancelAsync) {
				new Promise(resolve => {
					this.state.cancelLoading = true;
					this.$emit("cancel", resolve);
				}).then(value => {
					this.state.cancelLoading = false;

					if (value === false) {
						return;
					}

					this.close();
				});
			}
			else {
				this.$emit("cancel");
				this.close();
			}
		},
		handleOk() {
			const { $props: props } = this;

			if (props.okAsync) {
				new Promise(resolve => {
					this.state.okLoading = true;
					this.$emit("ok", resolve);
				}).then(value => {
					this.state.okLoading = false;

					if (value === false) {
						return;
					}

					this.close();
				});
			}
			else {
				this.$emit("ok");
				this.close();
			}
		},
		handleEnter() {
			this.$emit("open");

			if (this.vuiDrawer) {
				this.vuiDrawer.push();
			}
			else {
				this.scrollbarEffect = addScrollbarEffect();
			}
		},
		handleAfterEnter() {
			this.$emit("afterOpen");
		},
		handleLeave() {
			this.$emit("close");

			if (this.vuiDrawer) {
				this.vuiDrawer.pull();
			}
		},
		handleAfterLeave() {
			this.$emit("afterClose");

			if (this.scrollbarEffect) {
				this.scrollbarEffect.remove();
			}
		}
	},
	beforeDestroy() {
		if (this.scrollbarEffect) {
			this.scrollbarEffect.remove();
		}
	},
	render() {
		const { $slots: slots, $props: props, state, t: translate } = this;
		const { handleBackdropClick, handleWrapperClick, handleCancel, handleOk, handleEnter, handleAfterEnter, handleLeave, handleAfterLeave } = this;
		const showHeader = slots.title || props.title;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "drawer");
		let classes = {};

		classes.elBackdrop = {
			[`${classNamePrefix}-backdrop`]: true,
			[`${props.backdropClassName}`]: props.backdropClassName
		};
		classes.elWrapper = `${classNamePrefix}-wrapper`;
		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.placement}`]: props.placement,
			[`${classNamePrefix}-with-header`]: showHeader,
			[`${classNamePrefix}-with-footer`]: props.showFooter,
			[`${props.className}`]: props.className
		};
		classes.elHeader = `${classNamePrefix}-header`;
		classes.elTitle = `${classNamePrefix}-title`;
		classes.elBody = `${classNamePrefix}-body`;
		classes.elFooter = `${classNamePrefix}-footer`;
		classes.elBtnClose = `${classNamePrefix}-btn-close`;

		// styles
		let styles = {};

		styles.elBackdrop = {
			zIndex: state.zIndex
		};
		styles.elWrapper = {
			zIndex: state.zIndex
		};

		if (["left", "right"].indexOf(props.placement) > -1) {
			styles.el = {
				width: is.string(props.width) ? props.width : `${props.width}px`
			};
		}
		else {
			styles.el = {
				height: is.string(props.height) ? props.height : `${props.height}px`
			};
		}

		// render
		let children = [];

		if (props.backdrop) {
			let backdropProps = {
				class: classes.elBackdrop,
				style: [
					styles.elBackdrop,
					is.string(props.backdropStyle) ? styleToObject(props.backdropStyle) : props.backdropStyle
				]
			};

			if (props.clickBackdropToClose) {
				backdropProps.on = {
					click: handleCancel
				};
			}

			children.push(
				<transition appear name={props.animations[0]}>
					<div ref="backdrop" v-show={state.visible} {...backdropProps}></div>
				</transition>
			);
		}

		let header;

		if (showHeader) {
			header = (
				<div class={classes.elHeader} style={props.headerStyle}>
					<div class={classes.elTitle}>{slots.title || props.title}</div>
				</div>
			);
		}

		let body;

		body = (
			<div class={classes.elBody} style={props.bodyStyle}>{slots.default}</div>
		);

		let footer;

		if (props.showFooter) {
			if (slots.footer) {
				footer = (
					<div class={classes.elFooter} style={props.footerStyle}>{slots.footer}</div>
				);
			}
			else {
				let buttons = [];

				if (props.showCancelButton) {
					const cancelButtonProps = {
						props: {
							loading: state.cancelLoading
						},
						on: {
							click: handleCancel
						}
					};
					const mergedCancelButtonProps = merge(true, cancelButtonProps, props.cancelButtonProps);

					buttons.push(
						<VuiButton {...mergedCancelButtonProps}>{props.cancelText || translate("vui.drawer.cancelText")}</VuiButton>
					);
				}

				if (props.showOkButton) {
					const okButtonProps = {
						props: {
							type: "primary",
							loading: state.okLoading
						},
						on: {
							click: handleOk
						}
					};
					const mergedOkButtonProps = merge(true, okButtonProps, props.okButtonProps);

					buttons.push(
						<VuiButton {...mergedOkButtonProps}>{props.okText || translate("vui.drawer.okText")}</VuiButton>
					);
				}

				footer = (
					<div class={classes.elFooter}>{buttons}</div>
				);
			}
		}

		let btnClose;

		if (props.closable) {
			btnClose = (
				<div class={classes.elBtnClose} onClick={handleCancel}>
					<VuiIcon type="crossmark" />
				</div>
			);
		}

		children.push(
			<transition appear name={props.animations[0]}>
				<div ref="wrapper" v-show={state.visible} class={classes.elWrapper} style={styles.elWrapper} onClick={handleWrapperClick}>
					<transition appear name={props.animations[1]} onEnter={handleEnter} onAfterEnter={handleAfterEnter} onLeave={handleLeave} onAfterLeave={handleAfterLeave}>
						<div ref="drawer" v-show={state.visible} class={classes.el} style={styles.el}>
							{header}
							{body}
							{footer}
							{btnClose}
						</div>
					</transition>
				</div>
			</transition>
		);

		return (
			<VuiLazyRender status={state.visible}>
				<div v-portal={props.getPopupContainer}>
					{children}
				</div>
			</VuiLazyRender>
		);
	}
};

export default VuiDrawer;