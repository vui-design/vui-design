import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    gutter: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(4)
  };
};

export default {
  name: "vui-dropdown-menu-divider",
  props: createProps(),
  render() {
    const { $slots: slots, $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown-menu-divider");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    // style
    let styles = {};

    if (props.gutter) {
      const margin = is.string(props.gutter) ? props.gutter : `${props.gutter}px`;

      styles.el = {
        marginTop: margin,
        marginBottom: margin
      };
    }

    // render
    return (
      <div class={classes.el} style={styles.el}></div>
    );
  }
};