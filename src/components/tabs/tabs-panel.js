import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    data: PropTypes.object.def({}),
    destroyOnHide: PropTypes.bool.def(false)
  };
};

export default {
  name: "vui-tabs-panel",
  inject: {
    vuiTabs: {
      default: undefined
    }
  },
  props: createProps(),
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

    // render
    let content = props.data.children;

    if (!active && props.destroyOnHide) {
      content = null;
    }

    return (
      <div class={classes.el}>{content}</div>
    );
  }
};