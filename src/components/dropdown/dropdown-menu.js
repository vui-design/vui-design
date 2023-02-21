import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    color: PropTypes.oneOf(["light", "dark"]).def("light"),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };
};

export default {
  name: "vui-dropdown-menu",
  inject: {
    vuiDropdown: {
      default: undefined
    }
  },
  provide() {
    return {
      vuiDropdownMenu: this
    };
  },
  props: createProps(),
  render(h) {
    const { $slots: slots, $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown-menu");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.color}`]: props.color
    };

    // style
    let styles = {};

    if (props.width) {
      styles.el = {
        width: is.string(props.width) ? props.width : `${props.width}px`
      };
    }

    // render
    return (
      <div class={classes.el} style={styles.el}>{slots.default}</div>
    );
  }
};