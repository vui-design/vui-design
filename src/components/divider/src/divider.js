import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiDivider = {
  name: "vui-divider",
  props: {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["horizontal", "vertical"]).def("horizontal"),
    dashed: PropTypes.bool.def(false),
    orientation: PropTypes.oneOf(["left", "center", "right"]).def("center"),
    gutter: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  },
  render() {
    const { $slots: slots, $props: props } = this;
    const withText = props.type === "horizontal" && slots.default;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "divider");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.type}`]: props.type,
      [`${classNamePrefix}-dashed`]: props.dashed,
      [`${classNamePrefix}-with-text`]: withText,
      [`${classNamePrefix}-with-text-${props.orientation}`]: withText
    };
    classes.elText = `${classNamePrefix}-text`;

    // style
    let styles = {};

    if (props.gutter) {
      const gutter = is.string(props.gutter) ? props.gutter : `${props.gutter}px`;

      if (props.type === "horizontal") {
        styles.el = {
          marginTop: gutter,
          marginBottom: gutter
        };
      }
      else {
        styles.el = {
          marginLeft: gutter,
          marginRight: gutter
        };
      }
    }

    // render
    return (
      <div class={classes.el} style={styles.el}>
        {
          withText && (
            <div class={classes.elText}>{slots.default}</div>
          )
        }
      </div>
    );
  }
};

export default VuiDivider;