import VuiIcon from "vui-design/components/icon";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiTabsTab = {
  name: "vui-tabs-tab",
  inject: {
    vuiTabs: {
      default: undefined
    }
  },
  components: {
    VuiIcon
  },
  props: {
    classNamePrefix: PropTypes.string,
    data: PropTypes.object.def({})
  },
  methods: {
    handleClick(e) {
      const { $props: props } = this;

      if (props.data.disabled) {
        return;
      }

      this.$emit("click", props.data);
    },
    handleClose(e) {
      const { $props: props } = this;

      if (props.data.disabled) {
        return;
      }

      this.$emit("close", props.data);
      e.stopPropagation();
    }
  },
  render() {
    const { vuiTabs, $props: props } = this;
    const { state: vuiTabsState } = vuiTabs;
    const { handleClick, handleClose } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "tab");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-active`]: props.data.key === vuiTabsState.activeKey,
      [`${classNamePrefix}-disabled`]: props.data.disabled
    };
    classes.elContent = `${classNamePrefix}-content`;
    classes.elIcon = `${classNamePrefix}-icon`;
    classes.elTitle = `${classNamePrefix}-title`;
    classes.elBtnClose = `${classNamePrefix}-btn-close`;

    // render
    let icon;

    if (is.string(props.data.icon)) {
      icon = (
        <div class={classes.elIcon}>
          <VuiIcon type={props.data.icon} />
        </div>
      );
    }
    else if (is.array(props.data.icon)) {
      icon = (
        <div class={classes.elIcon}>
          {props.data.icon}
        </div>
      );
    }

    let btnClose;

    if (props.data.closable && !props.data.disabled) {
      btnClose = (
        <div class={classes.elBtnClose} onClick={handleClose}>
          <VuiIcon type="crossmark" />
        </div>
      );
    }

    return (
      <div class={classes.el} onClick={handleClick}>
        <div class={classes.elContent}>
          {icon}
          <div class={classes.elTitle}>{props.data.title}</div>
        </div>
        {btnClose}
      </div>
    );
  }
};

export default VuiTabsTab;