import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["default", "primary", "info", "warning", "success", "error", "danger", "dashed"]).def("default"),
    ghost: PropTypes.bool.def(false),
    shape: PropTypes.oneOf(["round"]),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    disabled: PropTypes.bool.def(false)
  };
};

export default {
  name: "vui-button-group",
  provide() {
    return {
      vuiButtonGroup: this
    };
  },
  props: createProps(),
  render() {
    const { $slots: slots, $props: props } = this;

    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "button-group");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    return (
      <div class={classes.el}>
        {slots.default}
      </div>
    );
  }
};