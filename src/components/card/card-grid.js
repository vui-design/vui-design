import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string
  };
};

export default {
  name: "vui-card-grid",
  props: createProps(),
  render(h) {
    const { $slots: slots, $props: props } = this;

    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "card-grid");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    return (
      <div class={classes.el}>{slots.default}</div>
    );
  }
};