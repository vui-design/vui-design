import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiButtonGroup = {
  name: "vui-button-group",
  provide() {
    return {
      vuiButtonGroup: this
    };
  },
  props: {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["default", "primary", "info", "warning", "success", "error", "danger", "dashed"]).def("default"),
    ghost: PropTypes.bool.def(false),
    shape: PropTypes.oneOf(["round"]),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    disabled: PropTypes.bool.def(false)
  },
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

export default VuiButtonGroup;