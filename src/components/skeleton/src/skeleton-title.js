import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiSkeletonTitle = {
  name: "vui-skeleton-title",
  props: {
    classNamePrefix: PropTypes.string,
    animated: PropTypes.bool.def(false),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  },
  render() {
    const { $props: props } = this;

    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "skeleton-title");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-animated`]: props.animated
    };

    let styles = {};

    styles.el = {
      width: is.number(props.width) ? `${props.width}px` : props.width
    };

    return (
      <div class={classes.el} style={styles.el}></div>
    );
  }
};

export default VuiSkeletonTitle;