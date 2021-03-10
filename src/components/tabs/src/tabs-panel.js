import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiTabsPanel = {
  name: "vui-tabs-panel",
  inject: {
    vuiTabs: {
      default: undefined
    }
  },
  props: {
    classNamePrefix: PropTypes.string,
    data: PropTypes.object.def({})
  },
  render() {
    const { vuiTabs, $props: props } = this;
    const { state: vuiTabsState } = vuiTabs;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "panel");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-active`]: props.data.key === vuiTabsState.activeKey,
      [`${classNamePrefix}-disabled`]: props.data.disabled
    };
    classes.elContent = `${classNamePrefix}-content`;

    // render
    return (
      <div class={classes.el}>
        <div class={classes.elContent}>{props.data.children}</div>
      </div>
    );
  }
};

export default VuiTabsPanel;