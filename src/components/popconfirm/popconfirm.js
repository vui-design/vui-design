import VuiPopover from "../popover";
import VuiIcon from "../icon";
import VuiButton from "../button";
import Locale from "../../mixins/locale";
import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    visible: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    icon: PropTypes.string,
    title: PropTypes.string,
    cancelButtonType: PropTypes.string.def("text"),
    cancelText: PropTypes.string,
    okButtonType: PropTypes.string.def("primary"),
    okText: PropTypes.string,
    minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(160),
    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(320),
    placement: PropTypes.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]).def("top"),
    animation: PropTypes.string,
    getPopupContainer: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element, PropTypes.func]).def(() => document.body)
  };
};

export default {
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
  props: createProps(),
  data() {
    const { $props: props } = this;
    const state = {
      visible: props.visible
    };

    return {
      state
    };
  },
  watch: {
    visible(value) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.state.visible = value;
    }
  },
  methods: {
    toggle(visible) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

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
    classes.elConfirmIcon = `${classNamePrefix}-confirm-icon`;
    classes.elConfirmTitle = `${classNamePrefix}-confirm-title`;
    classes.elConfirmFooter = `${classNamePrefix}-confirm-footer`;

    // render
    return (
      <VuiPopover trigger="click" classNamePrefix={props.classNamePrefix} visible={state.visible} disabled={props.disabled} minWidth={props.minWidth} maxWidth={props.maxWidth} placement={props.placement} animation={props.animation} getPopupContainer={props.getPopupContainer} onChange={handleChange}>
        {slots.default}
        <div slot="content" class={classes.elConfirm}>
          <div class={classes.elConfirmBody}>
            <div class={classes.elConfirmIcon}>{icon}</div>
            <div class={classes.elConfirmTitle}>{title}</div>
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