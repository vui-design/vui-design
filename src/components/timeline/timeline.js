import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    mode: PropTypes.oneOf(["left", "alternate", "right"]).def("left"),
    pending: PropTypes.bool.def(false)
  };
};

export default {
  name: "vui-timeline",
  props: createProps(),
  render() {
    const { $slots: slots, $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "timeline");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.mode}`]: true,
      [`${classNamePrefix}-pending`]: props.pending
    };

    return (
      <ul class={classes.el}>{slots.default}</ul>
    );
  }
};