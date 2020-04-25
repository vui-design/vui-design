import VuiIcon from "vui-design/components/icon";
import VuiButton from "vui-design/components/button";
import Portal from "vui-design/directives/portal";
import Locale from "vui-design/mixins/locale";
import Scrollbar from "vui-design/mixins/scrollbar";
import is from "vui-design/utils/is";
import merge from "vui-design/utils/merge";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import Popup from "vui-design/utils/popup";

const VuiModal = {
	name: "vui-modal",

	components: {
		VuiIcon,
		VuiButton
	},

	directives: {
		Portal
	},

	mixins: [
		Locale,
		Scrollbar
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
		top: {
			type: [String, Number],
			default: 100
		},
		centered: {
			type: Boolean,
			default: false
		},
		width: {
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
			type: Array,
			default: () => ["vui-modal-backdrop-fade", "vui-modal-zoom"]
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

		handleBackdropClick() {
			let { backdrop, clickBackdropToClose } = this;

			if (!backdrop || !clickBackdropToClose) {
				return;
			}

			this.handleCancel();
		},
		handleWrapperClick(e) {
			if (e.target !== this.$refs.wrapper) {
				return;
			}

			this.handleBackdropClick();
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
			this.addScrollbarEffect();
			this.$emit("open");
		},
		handleAfterEnter() {
			this.$emit("afterOpen");
		},
		handleLeave() {
			this.$emit("close");
		},
		handleAfterLeave() {
			this.removeScrollbarEffect();
			this.$emit("afterClose");
		}
	},

	render() {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, defaultVisible, title, showFooter, showCancelButton, cancelButtonProps, cancelText, cancelAsync, cancelLoading, showOkButton, okButtonProps, okText, okAsync, okLoading, closable, zIndex, top, centered, width, className, backdrop, backdropClassName, animations, getPopupContainer } = this;
		let { handleBackdropClick, handleWrapperClick, handleCancel, handleOk, handleEnter, handleAfterEnter, handleLeave, handleAfterLeave } = this;
		let showHeader = slots.title || title;
		let portal = getPopupContainer();

		// class
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "modal");
		let classes = {};

		classes.backdrop = {
			[`${classNamePrefix}-backdrop`]: true,
			[`${backdropClassName}`]: backdropClassName
		};
		classes.wrapper = {
			[`${classNamePrefix}-wrapper`]: true,
			[`${classNamePrefix}-wrapper-centered`]: centered
		};
		classes.modal = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-with-header`]: showHeader,
			[`${classNamePrefix}-with-footer`]: showFooter,
			[`${classNamePrefix}-centered`]: centered,
			[`${className}`]: className
		};
		classes.header = `${classNamePrefix}-header`;
		classes.title = `${classNamePrefix}-title`;
		classes.body = `${classNamePrefix}-body`;
		classes.footer = `${classNamePrefix}-footer`;
		classes.btnClose = `${classNamePrefix}-btn-close`;

		// style
		let styles = {};

		styles.backdrop = {
			zIndex
		};
		styles.wrapper = {
			zIndex,
			paddingTop: is.string(top) ? top : `${top}px`,
			paddingBottom: is.string(top) ? top : `${top}px`
		};
		styles.modal = {
			width: is.string(width) ? width : `${width}px`
		};

		if (centered) {
			delete styles.wrapper.paddingTop;
			delete styles.wrapper.paddingBottom;
		}

		// render
		let children = [];

		if (backdrop) {
			children.push(
				<transition name={animations[0]}>
					<div ref="backdrop" v-show={defaultVisible} class={classes.backdrop} style={styles.backdrop} onClick={handleBackdropClick}></div>
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
					let defaultCancelButtonProps = {
						props: {
							loading: cancelLoading
						},
						on: {
							click: handleCancel
						}
					};
					let mergedCancelButtonProps = merge(true, defaultCancelButtonProps, cancelButtonProps);

					buttons.push(
						<VuiButton {...mergedCancelButtonProps}>{cancelText || this.t("vui.drawer.cancelText")}</VuiButton>
					);
				}

				if (showOkButton) {
					let defaultOkButtonProps = {
						props: {
							type: "primary",
							loading: okLoading
						},
						on: {
							click: handleOk
						}
					};
					let mergedOkButtonProps = merge(true, defaultOkButtonProps, okButtonProps);

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
			<transition name={animations[0]}>
				<div ref="wrapper" v-show={defaultVisible} class={classes.wrapper} style={styles.wrapper} onClick={handleWrapperClick}>
					<transition name={animations[1]} onEnter={handleEnter} onAfterEnter={handleAfterEnter} onLeave={handleLeave} onAfterLeave={handleAfterLeave}>
						<div v-show={defaultVisible} class={classes.modal} style={styles.modal}>
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

export default VuiModal;