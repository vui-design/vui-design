import VuiIcon from "vui-design/components/icon";
import VuiButton from "vui-design/components/button";
import Portal from "vui-design/directives/portal";
import Locale from "vui-design/mixins/locale";
import is from "vui-design/utils/is";
import merge from "vui-design/utils/merge";
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
		Locale
	],

	model: {
		prop: "visible",
		event: "change"
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-modal"
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
		},
		handleAfterEnter() {
			this.$emit("afterOpen");
		},
		handleLeave() {
			this.$emit("close");
		},
		handleAfterLeave() {
			this.$emit("afterClose");
		}
	},

	render() {
		let { $slots, classNamePrefix, defaultVisible, title, showFooter, showCancelButton, cancelButtonProps, cancelText, cancelAsync, cancelLoading, showOkButton, okButtonProps, okText, okAsync, okLoading, closable, zIndex, top, centered, width, className, backdrop, backdropClassName, clickBackdropToClose, animations, getPopupContainer } = this;
		let { handleCancel, handleOk, handleEnter, handleAfterEnter, handleLeave, handleAfterLeave } = this;
		let showHeader = $slots.title || title;
		let portal = getPopupContainer();

		// classes
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

		// styles
		let styles = {};

		styles.backdrop = {
			zIndex
		};
		styles.wrapper = {
			zIndex
		};
		styles.modal = {
			top: `${top}px`,
			width: `${width}px`
		};

		if (centered) {
			delete styles.modal.top;
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
				<transition name={animations[0]}>
					<div v-show={defaultVisible} {...backdropProps}></div>
				</transition>
			);
		}

		let header;

		if (showHeader) {
			header = (
				<div class={classes.header}>
					<div class={classes.title}>{$slots.title || title}</div>
				</div>
			);
		}

		let body;

		body = (
			<div class={classes.body}>{$slots.default}</div>
		);

		let footer;

		if (showFooter) {
			if ($slots.footer) {
				footer = (
					<div class={classes.footer}>{$slots.footer}</div>
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
				<div v-show={defaultVisible} class={classes.wrapper} style={styles.wrapper}>
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