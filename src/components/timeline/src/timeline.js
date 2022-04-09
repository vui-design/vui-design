import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiTimeline = {
  name: "vui-timeline",
  props: {
    classNamePrefix: PropTypes.string,
    mode: PropTypes.oneOf(["left", "alternate", "right"]).def("left"),
    pending: PropTypes.bool.def(false)
  },
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

export default VuiTimeline;