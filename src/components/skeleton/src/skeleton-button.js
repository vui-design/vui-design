import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiSkeletonButton = {
  name: "vui-skeleton-button",
  props: {
    classNamePrefix: PropTypes.string,
    animated: PropTypes.bool.def(false),
    block: PropTypes.bool.def(false),
    shape: PropTypes.oneOf(["default", "round", "circle"]).def("default"),
    size: PropTypes.oneOf(["small", "medium", "large"]).def("medium")
  },
  render() {
    const { $props: props } = this;

    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "skeleton-button");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-animated`]: props.animated,
      [`${classNamePrefix}-block`]: props.block,
      [`${classNamePrefix}-${props.shape}`]: props.shape,
      [`${classNamePrefix}-${props.size}`]: props.size
    };

    return (
      <div class={classes.el}></div>
    );
  }
};

export default VuiSkeletonButton;