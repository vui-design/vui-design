import VuiIcon from "../../icon";
import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const mapIconTypes = {
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
		classNamePrefix: PropTypes.string,
		type: PropTypes.oneOf(["info", "warning", "success", "error"]).def("info"),
		icon: PropTypes.string,
		message: PropTypes.string,
		description: PropTypes.string,
		banner: PropTypes.bool.def(false),
		showIcon: PropTypes.bool.def(false),
		closable: PropTypes.bool.def(false),
		closeText: PropTypes.string,
		animation: PropTypes.string.def("vui-alert-slide-up")
	},
	data() {
		const state = {
			closed: false,
			closing: false
		};

		return {
			state
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
		const { $slots: slots, $props: props, state } = this;
		const { handleClose, handleAfterLeave } = this;
		const message = slots.default || slots.message || props.message;
		const description = slots.description || props.description;
		const closeText = slots.closeText || props.closeText;

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
					let iconType = mapIconTypes[props.type];

					if (!description) {
						iconType = iconType + "-filled";
					}

					icon = (
						<VuiIcon type={iconType} />
					);
				}
			}

			let btnClose;

			if (props.closable) {
				if (closeText) {
					btnClose = closeText;
				}
				else {
					btnClose = (
						<VuiIcon type="crossmark" />
					);
				}
			}

			const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "alert");
			let classes = {};

			classes.el = {
				[`${classNamePrefix}`]: true,
				[`${classNamePrefix}-${props.type}`]: props.type,
				[`${classNamePrefix}-banner`]: props.banner,
				[`${classNamePrefix}-with-icon`]: icon,
				[`${classNamePrefix}-with-description`]: description,
				[`${classNamePrefix}-closable`]: btnClose,
				[`${classNamePrefix}-closing`]: state.closing
			};
			classes.elIcon = `${classNamePrefix}-icon`;
			classes.elMessage = `${classNamePrefix}-message`;
			classes.elDescription = `${classNamePrefix}-description`;
			classes.elBtnClose =  `${classNamePrefix}-btn-close`;

			return (
				<transition name={props.animation} onAfterLeave={handleAfterLeave}>
					<div v-show={!state.closing} class={classes.el}>
						{
							icon && (
								<div class={classes.elIcon}>{icon}</div>
							)
						}
						<div class={classes.elMessage}>{message}</div>
						{
							description && (
								<div class={classes.elDescription}>{description}</div>
							)
						}
						{
							btnClose && (
								<div class={classes.elBtnClose} onClick={handleClose}>{btnClose}</div>
							)
						}
					</div>
				</transition>
			);
		}
	}
};

export default VuiAlert;