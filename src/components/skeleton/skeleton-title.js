import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    animated: PropTypes.bool.def(false),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };
};

export default {
  name: "vui-skeleton-title",
  props: createProps(),
  render() {
    const { $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "skeleton-title");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-animated`]: props.animated
    };

    // style
    let styles = {};

    styles.el = {
      width: is.number(props.width) ? `${props.width}px` : props.width
    };

    // render
    return (
      <div class={classes.el} style={styles.el}></div>
    );
  }
};