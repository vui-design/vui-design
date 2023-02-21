import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import getValidElements from "../../utils/getValidElements";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

const sizes = ["small", "medium", "large"];

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    block: PropTypes.bool.def(false),
    direction: PropTypes.oneOf(["horizontal", "vertical"]).def("horizontal"),
    justify: PropTypes.oneOf(["start", "center", "end", "around", "between"]).def("start"),
    align: PropTypes.oneOf(["start", "center", "end", "baseline", "stretch"]).def("center"),
    divider: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(false),
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def("medium")
  };
};

export default {
  name: "vui-space",
  props: createProps(),
  render(h) {
    const { $slots: slots, $props: props } = this;
    const isHorizontal = props.direction === "horizontal";
    const withPresetSize = props.size && sizes.indexOf(props.size) > -1;
    const withCustomSize = props.size && sizes.indexOf(props.size) === -1;

    // divider
    let divider = props.divider;

    // size
    let size;

    if (withCustomSize) {
      size = is.string(props.size) ? props.size : `${props.size}px`;
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "space");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-block`]: props.block,
      [`${classNamePrefix}-${props.direction}`]: props.direction,
      [`${classNamePrefix}-justify-${props.justify}`]: isHorizontal && props.justify,
      [`${classNamePrefix}-align-${props.align}`]: isHorizontal && props.align,
      [`${classNamePrefix}-with-divider`]: isHorizontal && divider,
      [`${classNamePrefix}-${props.size}`]: withPresetSize
    };
    classes.elItem = `${classNamePrefix}-item`;
    classes.elDivider = `${classNamePrefix}-divider`;

    // style
    let styles = {};

    styles.elItem = {};
    styles.elDivider = {};

    if (isHorizontal && divider) {
      if (is.string(divider) || is.number(divider)) {
        divider = is.string(divider) ? divider : `${divider}px`;

        styles.elDivider.height = divider;
      }

      if (withCustomSize) {
        styles.elDivider.marginLeft = styles.elDivider.marginRight = size;
      }
    }
    else if (withCustomSize) {
      const property = isHorizontal ? "marginLeft" : "marginTop";

      styles.elItem[property] = size;
    }

    // elements
    let elements = [];

    for (let name in slots) {
      const slot = slots[name];

      if (!slot) {
        continue;
      }

      elements = elements.concat(getValidElements(slot));
    }

    // render
    let children = [];

    elements.forEach((element, index) => {
      const notFirst = index > 0;

      if (notFirst && divider) {
        children.push(
          <i class={classes.elDivider} style={styles.elDivider}></i>
        );
      }

      children.push(
        <div class={classes.elItem} style={notFirst && styles.elItem}>{element}</div>
      );
    });

    return (
      <div class={classes.el}>{children}</div>
    );
  }
};