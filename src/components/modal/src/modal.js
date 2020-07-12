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
		showNotice: {
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
		let { $props: props } = this;

		return {
			state: {
				visible: props.visible,
				zIndex: Popup.nextZIndex(),
				cancelLoading: false,
				okLoading: false
			}
		};
	},

	computed: {
		visibility() {
			return this.state.visible;
		}
	},

	watch: {
		visible(value) {
			if (this.state.visible === value) {
				return;
			}

			this.state.visible = value;
		},
		visibility(value) {
			if (!value) {
				return;
			}

			this.state.zIndex = Popup.nextZIndex();
		}
	},

	methods: {
		open() {
			this.state.visible = true;
			this.$emit("change", true);
		},
		close() {
			this.state.visible = false;
			this.$emit("change", false);
		},
		handleBackdropClick() {
			let { $props: props } = this;

			if (!props.backdrop || !props.clickBackdropToClose) {
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
			let { $props: props } = this;

			if (props.cancelAsync) {
				new Promise(resolve => {
					this.state.cancelLoading = true;
					this.$emit("cancel", resolve);
				})
				.then(value => {
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
			let { $props: props } = this;

			if (props.okAsync) {
				new Promise(resolve => {
					this.state.okLoading = true;
					this.$emit("ok", resolve);
				})
				.then(value => {
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
		let { $slots: slots, $props: props, state } = this;
		let { handleBackdropClick, handleWrapperClick, handleCancel, handleOk, handleEnter, handleAfterEnter, handleLeave, handleAfterLeave } = this;
		let showHeader = slots.title || props.title;
		let portal = props.getPopupContainer();

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "modal");
		let classes = {};

		classes.elBackdrop = {
			[`${classNamePrefix}-backdrop`]: true,
			[`${props.backdropClassName}`]: props.backdropClassName
		};
		classes.elWrapper = {
			[`${classNamePrefix}-wrapper`]: true,
			[`${classNamePrefix}-wrapper-centered`]: props.centered
		};
		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-with-notice`]: props.showNotice,
			[`${classNamePrefix}-with-header`]: showHeader,
			[`${classNamePrefix}-with-footer`]: props.showFooter,
			[`${classNamePrefix}-centered`]: props.centered,
			[`${props.className}`]: props.className
		};
		classes.elHeader = `${classNamePrefix}-header`;
		classes.elTitle = `${classNamePrefix}-title`;
		classes.elBody = `${classNamePrefix}-body`;
		classes.elFooter = `${classNamePrefix}-footer`;
		classes.elBtnClose = `${classNamePrefix}-btn-close`;

		// style
		let styles = {};

		styles.elBackdrop = {
			zIndex: state.zIndex
		};
		styles.elWrapper = {
			zIndex: state.zIndex,
			paddingTop: is.string(props.top) ? props.top : `${props.top}px`,
			paddingBottom: is.string(props.top) ? props.top : `${props.top}px`
		};
		styles.el = {
			width: is.string(props.width) ? props.width : `${props.width}px`
		};

		if (props.centered) {
			delete styles.elWrapper.paddingTop;
			delete styles.elWrapper.paddingBottom;
		}

		// render
		let children = [];

		if (props.backdrop) {
			children.push(
				<transition name={props.animations[0]}>
					<div ref="backdrop" v-show={state.visible} class={classes.elBackdrop} style={styles.elBackdrop} onClick={handleBackdropClick}></div>
				</transition>
			);
		}

		let header;

		if (showHeader) {
			header = (
				<div class={classes.elHeader}>
					<div class={classes.elTitle}>{slots.title || props.title}</div>
				</div>
			);
		}

		let body;

		body = (
			<div class={classes.elBody}>{slots.default}</div>
		);

		let footer;

		if (props.showFooter) {
			if (slots.footer) {
				footer = (
					<div class={classes.elFooter}>{slots.footer}</div>
				);
			}
			else {
				let buttons = [];

				if (props.showCancelButton) {
					let cancelButtonProps = {
						props: {
							loading: state.cancelLoading
						},
						on: {
							click: handleCancel
						}
					};
					let mergedCancelButtonProps = merge(true, cancelButtonProps, props.cancelButtonProps);

					buttons.push(
						<VuiButton {...mergedCancelButtonProps}>{props.cancelText || this.t("vui.drawer.cancelText")}</VuiButton>
					);
				}

				if (props.showOkButton) {
					let okButtonProps = {
						props: {
							type: "primary",
							loading: state.okLoading
						},
						on: {
							click: handleOk
						}
					};
					let mergedOkButtonProps = merge(true, okButtonProps, props.okButtonProps);

					buttons.push(
						<VuiButton {...mergedOkButtonProps}>{props.okText || this.t("vui.drawer.okText")}</VuiButton>
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
			<transition name={props.animations[0]}>
				<div ref="wrapper" v-show={state.visible} class={classes.elWrapper} style={styles.elWrapper} onClick={handleWrapperClick}>
					<transition name={props.animations[1]} onEnter={handleEnter} onAfterEnter={handleAfterEnter} onLeave={handleLeave} onAfterLeave={handleAfterLeave}>
						<div v-show={state.visible} class={classes.el} style={styles.el}>
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