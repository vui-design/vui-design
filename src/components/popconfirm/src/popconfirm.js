import VuiPopover from "vui-design/components/popover";
import VuiIcon from "vui-design/components/icon";
import VuiButton from "vui-design/components/button";
import Locale from "vui-design/mixins/locale";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiPopconfirm = {
	name: "vui-popconfirm",

	components: {
		VuiPopover,
		VuiIcon,
		VuiButton
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
		icon: {
			type: String,
			default: undefined
		},
		title: {
			type: String,
			default: undefined
		},
		cancelButtonType: {
			type: String,
			default: "text"
		},
		okButtonType: {
			type: String,
			default: "primary"
		},
		cancelText: {
			type: String,
			default: undefined
		},
		okText: {
			type: String,
			default: undefined
		},
		minWidth: {
			type: [Number, String],
			default: 150
		},
		maxWidth: {
			type: [Number, String],
			default: 300
		},
		placement: {
			type: String,
			default: "top",
			validator: value => /^(top|bottom|left|right)(-start|-end)?$/g.test(value)
		},
		animation: {
			type: String,
			default: undefined
		},
		getPopupContainer: {
			type: Function,
			default: undefined
		}
	},

	data() {
		return {
			defaultVisible: this.visible
		};
	},

	watch: {
		visible(value) {
			this.defaultVisible = value;
		}
	},

	methods: {
		handleCancel() {
			this.defaultVisible = false;
			this.$emit("cancel");
			this.$emit("change", this.defaultVisible);
		},
		handleOk() {
			this.defaultVisible = false;
			this.$emit("ok");
			this.$emit("change", this.defaultVisible);
		},
		handleChange(visible) {
			this.defaultVisible = visible;
			this.$emit("change", this.defaultVisible);
		}
	},

	render() {
		let { t: translate, $slots: slots, classNamePrefix: customizedClassNamePrefix, defaultVisible: visible, icon, title, cancelButtonType, okButtonType, cancelText, okText, minWidth, maxWidth, placement, animation, getPopupContainer } = this;
		let { handleCancel, handleOk, handleChange } = this;

		// classes
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "popover");
		let classes = {};

		classes.elConfirm = `${classNamePrefix}-confirm`;
		classes.elConfirmBody = `${classNamePrefix}-confirm-body`;
		classes.elConfirmFooter = `${classNamePrefix}-confirm-footer`;

		// render
		if (slots.icon) {
			icon = slots.icon;
		}
		else {
			icon = (
				<VuiIcon type={icon || "help-filled"} />
			);
		}

		title = slots.title || title;
		cancelText = cancelText || translate("vui.popconfirm.cancelText");
		okText = okText || translate("vui.popconfirm.okText");

		return (
			<VuiPopover
				trigger="click"
				classNamePrefix={customizedClassNamePrefix}
				visible={visible}
				minWidth={minWidth}
				maxWidth={maxWidth}
				placement={placement}
				animation={animation}
				getPopupContainer={getPopupContainer}
				onChange={handleChange}
			>
				{slots.default}
				<div slot="content" class={classes.elConfirm}>
					<div class={classes.elConfirmBody}>
						{icon}
						{title}
					</div>
					<div class={classes.elConfirmFooter}>
						<VuiButton size="small" type={cancelButtonType} onClick={handleCancel}>
							{cancelText}
						</VuiButton>
						<VuiButton size="small" type={okButtonType} onClick={handleOk}>
							{okText}
						</VuiButton>
					</div>
				</div>
			</VuiPopover>
		);
	}
};

export default VuiPopconfirm;