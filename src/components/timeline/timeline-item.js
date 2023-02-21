import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

const colors = ["gray", "blue", "yellow", "green", "red"];

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    color: PropTypes.string.def("blue")
  };
};

export default {
  name: "vui-timeline-item",
  props: createProps(),
  render() {
    const { $slots: slots, $props: props } = this;

    // color
    const withPresetColor = props.color && colors.indexOf(props.color) > -1;
    const withCustomColor = props.color && colors.indexOf(props.color) === -1;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "timeline-item");
    let classes = {};

    classes.el = `${classNamePrefix}`;
    classes.tail = `${classNamePrefix}-tail`;
    classes.header = {
      [`${classNamePrefix}-header`]: true,
      [`${classNamePrefix}-header-custom`]: slots.dot,
      [`${classNamePrefix}-header-${props.color}`]: withPresetColor
    };
    classes.body = `${classNamePrefix}-body`;

    // style
    let styles = {};

    if (withCustomColor) {
      styles.header = {
        borderColor: props.color,
        color: props.color
      };
    }

    // render
    return (
      <li class={classes.el}>
        <div class={classes.tail}></div>
        <div class={classes.header} style={styles.header}>{slots.dot}</div>
        <div class={classes.body}>{slots.default}</div>
      </li>
    );
  }
};