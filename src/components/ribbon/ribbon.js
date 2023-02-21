import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

const colors = ["blue", "cyan", "geekblue", "gold", "green", "lime", "magenta", "orange", "pink", "purple", "red", "volcano", "yellow"];

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    placement: PropTypes.oneOf(["start", "end"]).def("end"),
    type: PropTypes.oneOf(["default", "primary", "info", "warning", "success", "error"]).def("primary"),
    color: PropTypes.string,
    text: PropTypes.string
  };
};

export default {
  name: "vui-ribbon",
  props: createProps(),
  render() {
    const { $slots: slots, $props: props } = this;

    // color
    const withPresetColor = props.color && colors.indexOf(props.color) > -1;
    const withCustomColor = props.color && colors.indexOf(props.color) === -1;

    // text
    const text = slots.text || props.text;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "ribbon");
    let classes = {};

    classes.elWrapper = `${classNamePrefix}-wrapper`;
    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-placement-${props.placement}`]: true,
      [`${classNamePrefix}-${props.type}`]: props.type && !withPresetColor && !withCustomColor,
      [`${classNamePrefix}-color-${props.color}`]: withPresetColor
    };
    classes.elText = `${classNamePrefix}-text`;
    classes.elCorner = `${classNamePrefix}-corner`;

    // style
    let styles = {};

    if (withCustomColor) {
      styles.el = {
        backgroundColor: props.color,
        color: "#fff"
      };
      styles.elCorner = {
        color: props.color
      };
    }

    // render
    let children = [];

    children.push(slots.default);

    if (text) {
      children.push(
        <div class={classes.el} style={styles.el}>
          <div class={classes.elText}>{text}</div>
          <div class={classes.elCorner} style={styles.elCorner}></div>
        </div>
      );
    }

    return (
      <div class={classes.elWrapper}>
        {children}
      </div>
    );
  }
};