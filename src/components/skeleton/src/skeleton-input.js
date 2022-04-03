import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiSkeletonInput = {
  name: "vui-skeleton-input",
  props: {
    classNamePrefix: PropTypes.string,
    animated: PropTypes.bool.def(false),
    block: PropTypes.bool.def(false),
    size: PropTypes.oneOf(["small", "medium", "large"]).def("medium")
  },
  render() {
    const { $props: props } = this;

    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "skeleton-input");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-animated`]: props.animated,
      [`${classNamePrefix}-block`]: props.block,
      [`${classNamePrefix}-${props.size}`]: props.size
    };

    return (
      <div class={classes.el}></div>
    );
  }
};

export default VuiSkeletonInput;