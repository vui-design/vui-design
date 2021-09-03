import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";
import "../../../icons";

const VuiIcon = {
  name: "vui-icon",
  props: {
    classNamePrefix: PropTypes.string,
    type: PropTypes.string,
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  },
  render(h) {
    const { $props: props, $listeners: listeners } = this;

    // xlinkHref
    const xlinkHref = "#icon-" + props.type;

    // fontSize
    let fontSize;

    if (is.string(props.size)) {
      fontSize = props.size;
    }
    else if (is.number(props.size)) {
      fontSize = props.size + "px";
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "icon");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.type}`]: props.type
    };

    // style
    let styles = {};

    styles.el = {
      color: props.color,
      fontSize: fontSize
    };

    // render
    const attributes = {
      class: classes.el,
      style: styles.el,
      on: {
        ...listeners
      }
    };

    return (
      <i {...attributes}>
        <svg aria-hidden="true">
          <use xlinkHref={xlinkHref} />
        </svg>
      </i>
    );
  }
};

export default VuiIcon;