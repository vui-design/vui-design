import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const colors = ["blue", "cyan", "geekblue", "gold", "green", "lime", "magenta", "orange", "pink", "purple", "red", "volcano", "yellow"];

const VuiRibbon = {
  name: "vui-ribbon",
  props: {
    classNamePrefix: PropTypes.string,
    placement: PropTypes.oneOf(["start", "end"]).def("end"),
    type: PropTypes.oneOf(["default", "primary", "info", "warning", "success", "error"]).def("primary"),
    color: PropTypes.string,
    text: PropTypes.string
  },
  render() {
    const { $slots: slots, $props: props } = this;

    // color
    const withPresetColor = props.color && colors.indexOf(props.color) > -1;
    const withCustomColor = props.color && colors.indexOf(props.color) === -1;

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

    return (
      <div class={classes.elWrapper}>
        {slots.default}
        <div class={classes.el} style={styles.el}>
          <div class={classes.elText}>{slots.text || props.text}</div>
          <div class={classes.elCorner} style={styles.elCorner}></div>
        </div>
      </div>
    );
  }
};

export default VuiRibbon;