import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiLayout = {
  name: "vui-layout",
  props: {
    classNamePrefix: PropTypes.string,
    withSider: PropTypes.bool.def(false)
  },
  render(h) {
    const { $slots: slots, $props: props } = this;

    // withSider
    let withSider = props.withSider;

    withSider = slots.default && slots.default.some(element => {
      return element.componentOptions && element.componentOptions.tag === "vui-sider";
    });

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "layout");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-with-sider`]: withSider
    };

    // render
    return (
      <div class={classes.el}>{slots.default}</div>
    );
  }
};

export default VuiLayout;