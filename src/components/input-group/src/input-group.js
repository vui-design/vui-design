import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiInputGroup = {
  name: "vui-input-group",
  provide() {
    return {
      vuiInputGroup: this
    };
  },
  props: {
    classNamePrefix: PropTypes.string,
    compact: PropTypes.bool.def(false),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    disabled: PropTypes.bool.def(false)
  },
  render() {
    const { $slots: slots, $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "input-group");
    const classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-compact`]: props.compact
    };

    // render
    return (
      <div class={classes.el}>{slots.default}</div>
    );
  }
};

export default VuiInputGroup;