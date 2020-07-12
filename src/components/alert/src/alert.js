import VuiIcon from "vui-design/components/icon";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const defaultIconTypes = {
	info: "info",
	warning: "warning",
	success: "checkmark-circle",
	error: "crossmark-circle"
};

const VuiAlert = {
	name: "vui-alert",

	components: {
		VuiIcon
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		type: {
			type: String,
			default: "info",
			validator: value => ["info", "warning", "success", "error"].indexOf(value) > -1
		},
		icon: {
			type: String,
			default: undefined
		},
		message: {
			type: String,
			default: undefined
		},
		description: {
			type: String,
			default: undefined
		},
		banner: {
			type: Boolean,
			default: false
		},
		showIcon: {
			type: Boolean,
			default: false
		},
		closable: {
			type: Boolean,
			default: false
		},
		closeText: {
			type: String,
			default: undefined
		},
		animation: {
			type: String,
			default: "vui-alert-slide-up"
		}
	},

	data() {
		return {
			state: {
				closed: false,
				closing: false
			}
		};
	},

	methods: {
		handleClose(e) {
			e.preventDefault();

			let element = this.$el;

			element.style.height = `${element.offsetHeight}px`;
			// 重复一次才能正确设置 height 高度，why？
			element.style.height = `${element.offsetHeight}px`;

			this.state.closing = true;
			this.$emit("close", e);
		},
		handleAfterLeave() {
			this.state.closed = true;
			this.state.closing = false;
			this.$emit("afterClose");
		}
	},

	render() {
		let { $slots: slots, $props: props, state } = this;
		let { handleClose, handleAfterLeave } = this;

		if (state.closed) {
			return null;
		}
		else {
			let icon;

			if (props.showIcon) {
				if (slots.icon) {
					icon = slots.icon;
				}
				else if (props.icon) {
					icon = (
						<VuiIcon type={prop.icon} />
					);
				}
				else {
					let defaultIconType = defaultIconTypes[props.type];
					let iconType = (slots.description || props.description) ? defaultIconType : (defaultIconType + "-filled");

					icon = (
						<VuiIcon type={iconType} />
					);
				}
			}

			let btnClose;

			if (props.closable) {
				if (props.closeText) {
					btnClose = props.closeText;
				}
				else {
					btnClose = (
						<VuiIcon type="crossmark" />
					);
				}
			}

			let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "alert");
			let classes = {};

			classes.el = {
				[`${classNamePrefix}`]: true,
				[`${classNamePrefix}-${props.type}`]: props.type,
				[`${classNamePrefix}-banner`]: props.banner,
				[`${classNamePrefix}-with-icon`]: icon,
				[`${classNamePrefix}-with-description`]: slots.description || props.description,
				[`${classNamePrefix}-closable`]: btnClose,
				[`${classNamePrefix}-closing`]: state.closing
			};
			classes.elIcon = `${classNamePrefix}-icon`;
			classes.elMessage = `${classNamePrefix}-message`;
			classes.elDescription = `${classNamePrefix}-description`;
			classes.elBtnClose =  `${classNamePrefix}-btn-close`;

			let children = [];

			if (icon) {
				children.push(
					<div class={classes.elIcon}>
						{icon}
					</div>
				);
			}

			children.push(
				<div class={classes.elMessage}>
					{slots.default || props.message}
				</div>
			);

			if (slots.description || props.description) {
				children.push(
					<div class={classes.elDescription}>
						{slots.description || props.description}
					</div>
				);
			}

			if (btnClose) {
				children.push(
					<div class={classes.elBtnClose} onClick={handleClose}>
						{btnClose}
					</div>
				);
			}

			return (
				<transition appear={false} name={props.animation} onAfterLeave={handleAfterLeave}>
					<div v-show={!state.closing} class={classes.el}>{children}</div>
				</transition>
			);
		}
	}
};

export default VuiAlert;