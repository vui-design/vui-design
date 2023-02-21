import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string
  };
};

export default {
  name: "vui-footer",
  props: createProps(),
  render(h) {
    const { $slots: slots, $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "layout-footer");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true
    };

    // render
    return (
      <div class={classes.el}>
        {slots.default}
      </div>
    );
  }
};