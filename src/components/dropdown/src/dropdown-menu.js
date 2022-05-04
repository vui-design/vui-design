import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiDropdownMenu = {
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
  props: {
    classNamePrefix: PropTypes.string,
    color: PropTypes.oneOf(["light", "dark"]).def("light"),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  },
  render(h) {
    const { $slots: slots, $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown-menu");
    const classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.color}`]: props.color
    };

    // styles
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

export default VuiDropdownMenu;