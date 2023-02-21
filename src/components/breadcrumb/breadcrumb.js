import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    separator: PropTypes.string.def("/")
  };
};

export default {
  name: "vui-breadcrumb",
  provide() {
    return {
      vuiBreadcrumb: this
    };
  },
  props: createProps(),
  render() {
    const { $slots: slots, $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "breadcrumb");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    // render
    return (
      <div class={classes.el}>{slots.default}</div>
    );
  }
};