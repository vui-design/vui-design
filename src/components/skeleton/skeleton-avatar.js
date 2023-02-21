import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

const shapes = ["circle", "square"];
const sizes = ["small", "medium", "large"];

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    animated: PropTypes.bool.def(false),
    shape: PropTypes.oneOf(shapes).def("circle"),
    size: PropTypes.oneOfType([PropTypes.oneOf(sizes), PropTypes.number]).def("medium")
  };
};

export default {
  name: "vui-skeleton-avatar",
  props: createProps(),
  render() {
    const { $props: props } = this;
    const isPresetSize =  sizes.indexOf(props.size) > -1;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "skeleton-avatar");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-animated`]: props.animated,
      [`${classNamePrefix}-${props.shape}`]: props.shape,
      [`${classNamePrefix}-${props.size}`]: props.size && isPresetSize
    };

    // style
    let styles = {};

    if (props.size && !isPresetSize) {
      styles.el = {
        width: `${props.size}px`,
        height: `${props.size}px`
      };
    }

    // render
    return (
      <div class={classes.el} style={styles.el}></div>
    );
  }
};