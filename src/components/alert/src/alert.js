import VuiIcon from "vui-design/components/icon";

const icons = {
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
			default: "vui-alert"
		},
		type: {
			type: String,
			default: "info",
			validator(value) {
				return ["info", "warning", "success", "error"].indexOf(value) > -1;
			}
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
			default: "vui-alert-slide"
		}
	},

	data() {
		return {
			visible: true
		};
	},

	methods: {
		handleClose(e) {
			this.visible = false;
			this.$emit("close", e);
		}
	},

	render() {
		let { $slots, classNamePrefix, type, message, description, banner, showIcon, closable, closeText, animation, visible } = this;
		let { handleClose } = this;

		// icon
		let icon;

		if (this.icon) {
			icon = this.icon;
		}
		else {
			icon = ($slots.description || description) ? icons[type] : `${icons[type]}-filled`;
		}

		// classes
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${type}`]: type,
			[`${classNamePrefix}-banner`]: banner,
			[`${classNamePrefix}-with-icon`]: showIcon && ($slots.icon || icon),
			[`${classNamePrefix}-with-description`]: $slots.description || description,
			[`${classNamePrefix}-closable`]: closable
		};
		classes.icon = `${classNamePrefix}-icon`;
		classes.message = `${classNamePrefix}-message`;
		classes.description = `${classNamePrefix}-description`;
		classes.btnClose =  `${classNamePrefix}-btn-close`;

		// render
		let children = [];

		if (showIcon && ($slots.icon || icon)) {
			children.push(
				<div class={classes.icon}>
					{$slots.icon || <VuiIcon type={icon} />}
				</div>
			);
		}

		children.push(
			<div class={classes.message}>
				{$slots.default || message}
			</div>
		);

		if ($slots.description || description) {
			children.push(
				<div class={classes.description}>
					{$slots.description || description}
				</div>
			);
		}

		if (closable) {
			children.push(
				<div class={classes.btnClose} onClick={handleClose}>
					{closeText || <VuiIcon type="crossmark" />}
				</div>
			);
		}

		return (
			<transition name={animation}>
				{visible && <div class={classes.el}>{children}</div>}
			</transition>
		);
	}
};

export default VuiAlert;