import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import range from "../../utils/range";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

const widthProp = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    animated: PropTypes.bool.def(false),
    rows: PropTypes.number,
    width: PropTypes.oneOfType([widthProp, PropTypes.arrayOf(widthProp)])
  };
};

export default {
  name: "vui-skeleton-paragraph",
  props: createProps(),
  methods: {
    getWidthProperty(index) {
      const { $props: props } = this;

      if (is.array(props.width)) {
        return props.width[index];
      }

      if (index === props.rows - 1) {
        return props.width;
      }

      return undefined;
    }
  },
  render() {
    const { $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "skeleton-paragraph");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-animated`]: props.animated
    };

    // render
    const rows = range(0, props.rows).map((row, index) => {
      const width = this.getWidthProperty(index);
      const style = {
        width: is.number(width) ? `${width}px` : width
      };

      return (
        <li key={index} style={style} />
      );
    });

    return (
      <ul class={classes.el}>{rows}</ul>
    );
  }
};