import VuiIcon from "vui-design/components/icon";

const VuiTabTrigger = {
	name: "vui-tab-trigger",

	inject: {
		vuiTabs: {
			default: undefined
		}
	},

	components: {
		VuiIcon
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-tab-trigger"
		},
		name: {
			type: [String, Number],
			default: undefined
		},
		icon: {
			type: String,
			default: undefined
		},
		closable: {
			type: Boolean,
			default: false
		},
		active: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	methods: {
		handleClick(e) {
			let { name, disabled } = this;

			if (disabled) {
				return;
			}

			this.$emit("click", e, name);
		},
		handleClose(e) {
			let { name, disabled } = this;

			if (disabled) {
				return;
			}

			this.$emit("close", e, name);
		}
	},

	render() {
		let { $slots, classNamePrefix, icon, closable, active, disabled } = this;
		let { handleClick, handleClose } = this;
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-active`]: active,
			[`${classNamePrefix}-disabled`]: disabled
		};
		classes.content = `${classNamePrefix}-content`;
		classes.icon = `${classNamePrefix}-icon`;
		classes.title = `${classNamePrefix}-title`;
		classes.btnClose = `${classNamePrefix}-btn-close`;

		return (
			<div class={classes.el} onClick={handleClick}>
				<div class={classes.content}>
					{
						icon ? (
							<VuiIcon type={icon} class={classes.icon} />
						) : null
					}
					<div class={classes.title}>{$slots.default}</div>
				</div>
				{
					closable && !disabled ? (
						<a href="javascript:;" class={classes.btnClose} onClick={handleClose}>
							<svg viewBox="0 0 28 28">
								<path d="M16,14l9.9-11.5C26.1,2.3,26,2,25.7,2h-3c-0.2,0-0.3,0.1-0.5,0.2L14,11.7L5.8,2.2C5.7,2.1,5.5,2,5.3,2h-3C2,2,1.9,2.3,2.1,2.5L12,14L2.1,25.5c-0.1,0.1-0.1,0.3,0,0.4C2.2,26,2.2,26,2.3,26h3c0.2,0,0.3-0.1,0.5-0.2l8.2-9.5l8.2,9.5c0.1,0.1,0.3,0.2,0.5,0.2h3c0.3,0,0.4-0.3,0.2-0.5L16,14z" />
							</svg>
						</a>
					) : null
				}
			</div>
		);
	}
};

export default VuiTabTrigger;