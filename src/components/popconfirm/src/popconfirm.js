import VuiPopover from "vui-design/components/popover";
import VuiIcon from "vui-design/components/icon";
import VuiButton from "vui-design/components/button";
import Locale from "vui-design/mixins/locale";
import PropTypes from "vui-design/utils/prop-types";
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
		event: "input"
	},
	props: {
		classNamePrefix: PropTypes.string,
		visible: PropTypes.bool.def(false),
		icon: PropTypes.string,
		title: PropTypes.string,
		cancelButtonType: PropTypes.string.def("text"),
		okButtonType: PropTypes.string.def("primary"),
		cancelText: PropTypes.string,
		okText: PropTypes.string,
		minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(150),
		maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(300),
		placement: PropTypes.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]).def("top"),
		animation: PropTypes.string,
		getPopupContainer: PropTypes.func.def(() => document.body)
	},
	data() {
		const { $props: props } = this;

		return {
			state: {
				visible: props.visible
			}
		};
	},
	watch: {
		visible(value) {
			this.state.visible = value;
		}
	},
	methods: {
		toggle(visible) {
			this.state.visible = visible;
			this.$emit("input", visible);
			this.$emit("change", visible);
		},
		handleCancel() {
			this.toggle(false);
			this.$emit("cancel");
		},
		handleOk() {
			this.toggle(false);
			this.$emit("ok");
		},
		handleChange(visible) {
			this.toggle(visible);
		}
	},
	render() {
		const { $slots: slots, $props: props, state, t: translate } = this;
		const { handleCancel, handleOk, handleChange } = this;

		// icon
		let icon;

		if (slots.icon) {
			icon = slots.icon;
		}
		else {
			const iconType = props.icon || "help-filled";

			icon = (
				<VuiIcon type={iconType} />
			);
		}

		// title
		const title = slots.title || props.title;

		// button text
		const cancelText = props.cancelText || translate("vui.popconfirm.cancelText");
		const okText = props.okText || translate("vui.popconfirm.okText");

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "popover");
		let classes = {};

		classes.elConfirm = `${classNamePrefix}-confirm`;
		classes.elConfirmBody = `${classNamePrefix}-confirm-body`;
		classes.elConfirmFooter = `${classNamePrefix}-confirm-footer`;

		// render
		return (
			<VuiPopover trigger="click" classNamePrefix={props.classNamePrefix} visible={state.visible} minWidth={props.minWidth} maxWidth={props.maxWidth} placement={props.placement} animation={props.animation} getPopupContainer={props.getPopupContainer} onChange={handleChange}>
				{slots.default}
				<div slot="content" class={classes.elConfirm}>
					<div class={classes.elConfirmBody}>
						{icon}
						{title}
					</div>
					<div class={classes.elConfirmFooter}>
						<VuiButton size="small" type={props.cancelButtonType} onClick={handleCancel}>{cancelText}</VuiButton>
						<VuiButton size="small" type={props.okButtonType} onClick={handleOk}>{okText}</VuiButton>
					</div>
				</div>
			</VuiPopover>
		);
	}
};

export default VuiPopconfirm;