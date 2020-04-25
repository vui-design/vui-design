import VuiIcon from "vui-design/components/icon";
import VuiButton from "vui-design/components/button";
import Portal from "vui-design/directives/portal";
import Locale from "vui-design/mixins/locale";
import Popup from "vui-design/utils/popup";
import merge from "vui-design/utils/merge";
import is from "vui-design/utils/is";
import getStyle from "vui-design/utils/getStyle";
import css from "vui-design/utils/css";
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
		title: {
			type: String,
			default: undefined
		},
		showFooter: {
			type: Boolean,
			default: true
		},
		showCancelButton: {
			type: Boolean,
			default: true
		},
		cancelButtonProps: {
			type: Object,
			default: undefined
		},
		cancelText: {
			type: String
		},
		cancelAsync: {
			type: Boolean,
			default: false
		},
		showOkButton: {
			type: Boolean,
			default: true
		},
		okButtonProps: {
			type: Object,
			default: undefined
		},
		okText: {
			type: String
		},
		okAsync: {
			type: Boolean,
			default: false
		},
		closable: {
			type: Boolean,
			default: true
		},
		placement: {
			type: String,
			default: "right",
			validator: value => ["top", "bottom", "left", "right"].indexOf(value) > -1
		},
		width: {
			type: [String, Number],
			default: 500
		},
		height: {
			type: [String, Number],
			default: 500
		},
		className: {
			type: String,
			default: undefined
		},
		backdrop: {
			type: Boolean,
			default: true
		},
		backdropClassName: {
			type: String,
			default: undefined
		},
		clickBackdropToClose: {
			type: Boolean,
			default: true
		},
		animations: {
			type: Object,
			default: () => {
				return {
					backdrop: "vui-drawer-backdrop-fade",
					drawer: "vui-drawer-slide"
				};
			}
		},
		getPopupContainer: {
			type: Function,
			default: () => document.body
		}
	},

	data() {
		return {
			defaultVisible: this.visible,
			zIndex: Popup.nextZIndex(),
			cancelLoading: false,
			okLoading: false
		};
	},

	watch: {
		visible(value) {
			if (this.defaultVisible === value) {
				return;
			}

			this.defaultVisible = value;
		},
		defaultVisible(value) {
			if (!value) {
				return;
			}

			this.zIndex = Popup.nextZIndex();
		}
	},

	methods: {
		open() {
			this.defaultVisible = true;
			this.$emit("change", true);
		},
		close() {
			this.defaultVisible = false;
			this.$emit("change", false);
		},

		push() {
			const reference = this.$refs.drawer;
			const placement = this.placement;
			const distance = parseInt(getStyle(reference, placement)) + 250;

			css(reference, placement, distance + "px");

			this.vuiDrawer && this.vuiDrawer.push();
		},
		pull() {
			const reference = this.$refs.drawer;
			const placement = this.placement;
			const distance = parseInt(getStyle(reference, placement)) - 250;

			css(reference, placement, distance + "px");

			this.vuiDrawer && this.vuiDrawer.pull();
		},

		handleCancel() {
			if (this.cancelAsync) {
				new Promise(resolve => {
					this.cancelLoading = true;
					this.$emit("cancel", resolve);
				})
				.then(value => {
					this.cancelLoading = false;

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
			if (this.okAsync) {
				new Promise(resolve => {
					this.okLoading = true;
					this.$emit("ok", resolve);
				})
				.then(value => {
					this.okLoading = false;

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
			this.vuiDrawer && this.vuiDrawer.push();
		},
		handleAfterEnter() {
			this.$emit("afterOpen");
		},
		handleLeave() {
			this.$emit("close");
			this.vuiDrawer && this.vuiDrawer.pull();
		},
		handleAfterLeave() {
			this.$emit("afterClose");
		}
	},

	render() {
		const { $slots: slots, classNamePrefix: customizedClassNamePrefix, defaultVisible, title, showFooter, showCancelButton, cancelButtonProps, cancelText, cancelAsync, cancelLoading, showOkButton, okButtonProps, okText, okAsync, okLoading, closable, placement, zIndex, width, height, className, backdrop, backdropClassName, clickBackdropToClose, animations, getPopupContainer } = this;
		const { handleCancel, handleOk, handleEnter, handleAfterEnter, handleLeave, handleAfterLeave } = this;
		const showHeader = slots.title || title;
		const portal = getPopupContainer();

		// classes
		const classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "drawer");
		let classes = {};

		classes.backdrop = {
			[`${classNamePrefix}-backdrop`]: true,
			[`${backdropClassName}`]: backdropClassName
		};
		classes.wrapper = `${classNamePrefix}-wrapper`;
		classes.drawer = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${placement}`]: placement,
			[`${classNamePrefix}-with-header`]: showHeader,
			[`${classNamePrefix}-with-footer`]: showFooter,
			[`${className}`]: className
		};
		classes.header = `${classNamePrefix}-header`;
		classes.title = `${classNamePrefix}-title`;
		classes.body = `${classNamePrefix}-body`;
		classes.footer = `${classNamePrefix}-footer`;
		classes.btnClose = `${classNamePrefix}-btn-close`;

		// styles
		let styles = {};

		styles.backdrop = {
			zIndex
		};
		styles.wrapper = {
			zIndex
		};

		if (["top", "bottom"].indexOf(placement) > -1) {
			styles.drawer = {
				height: is.string(height) ? height : `${height}px`
			};
		}
		else {
			styles.drawer = {
				width: is.string(width) ? width : `${width}px`
			};
		}

		// render
		let children = [];

		if (backdrop) {
			let backdropProps = {
				class: classes.backdrop,
				style: styles.backdrop
			};

			if (clickBackdropToClose) {
				backdropProps.on = {
					click: handleCancel
				};
			}

			children.push(
				<transition name={animations.backdrop}>
					<div v-show={defaultVisible} {...backdropProps}></div>
				</transition>
			);
		}

		let header;

		if (showHeader) {
			header = (
				<div class={classes.header}>
					<div class={classes.title}>{slots.title || title}</div>
				</div>
			);
		}

		let body;

		body = (
			<div class={classes.body}>{slots.default}</div>
		);

		let footer;

		if (showFooter) {
			if (slots.footer) {
				footer = (
					<div class={classes.footer}>{slots.footer}</div>
				);
			}
			else {
				let buttons = [];

				if (showCancelButton) {
					const defaultCancelButtonProps = {
						props: {
							loading: cancelLoading
						},
						on: {
							click: handleCancel
						}
					};
					const mergedCancelButtonProps = merge(true, defaultCancelButtonProps, cancelButtonProps);

					buttons.push(
						<VuiButton {...mergedCancelButtonProps}>{cancelText || this.t("vui.drawer.cancelText")}</VuiButton>
					);
				}

				if (showOkButton) {
					const defaultOkButtonProps = {
						props: {
							type: "primary",
							loading: okLoading
						},
						on: {
							click: handleOk
						}
					};
					const mergedOkButtonProps = merge(true, defaultOkButtonProps, okButtonProps);

					buttons.push(
						<VuiButton {...mergedOkButtonProps}>{okText || this.t("vui.drawer.okText")}</VuiButton>
					);
				}

				footer = (
					<div class={classes.footer}>{buttons}</div>
				);
			}
		}

		let btnClose;

		if (closable) {
			btnClose = (
				<div class={classes.btnClose} onClick={handleCancel}>
					<VuiIcon type="crossmark" />
				</div>
			);
		}

		children.push(
			<transition name={animations.backdrop}>
				<div v-show={defaultVisible} class={classes.wrapper} style={styles.wrapper}>
					<transition name={animations.drawer} onEnter={handleEnter} onAfterEnter={handleAfterEnter} onLeave={handleLeave} onAfterLeave={handleAfterLeave}>
						<div v-show={defaultVisible} ref="drawer" class={classes.drawer} style={styles.drawer}>
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
			<div v-portal={portal}>
				{children}
			</div>
		);
	}
};

export default VuiDrawer;