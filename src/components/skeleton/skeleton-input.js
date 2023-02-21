import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    animated: PropTypes.bool.def(false),
    block: PropTypes.bool.def(false),
    size: PropTypes.oneOf(["small", "medium", "large"]).def("medium")
  };
};

export default {
  name: "vui-skeleton-input",
  props: createProps(),
  render() {
    const { $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "skeleton-input");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-animated`]: props.animated,
      [`${classNamePrefix}-block`]: props.block,
      [`${classNamePrefix}-${props.size}`]: props.size
    };

    // render
    return (
      <div class={classes.el}></div>
    );
  }
};