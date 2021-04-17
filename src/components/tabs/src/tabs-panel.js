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
    data: PropTypes.object.def({}),
    destroyOnHide: PropTypes.bool.def(false)
  },
  render() {
    const { vuiTabs, $props: props } = this;
    const { state: vuiTabsState } = vuiTabs;

    // active
    const active = props.data.key === vuiTabsState.activeKey;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "panel");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-active`]: active,
      [`${classNamePrefix}-disabled`]: props.data.disabled
    };
    classes.elContent = `${classNamePrefix}-content`;

    // render
    let content = props.data.children;
    
    if (!active && props.destroyOnHide) {
      content = null;
    }

    return (
      <div class={classes.el}>
        <div class={classes.elContent}>{content}</div>
      </div>
    );
  }
};

export default VuiTabsPanel;