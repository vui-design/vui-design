import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    compact: PropTypes.bool.def(false),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    disabled: PropTypes.bool.def(false)
  };
};

export default {
  name: "vui-input-group",
  provide() {
    return {
      vuiInputGroup: this
    };
  },
  props: createProps(),
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