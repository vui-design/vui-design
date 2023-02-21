import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    data: PropTypes.object.def({})
  };
};

export default {
  name: "vui-select-menu-item-group",
  inject: {
    vuiSelect: {
      default: undefined
    }
  },
  props: createProps(),
  render(h) {
    const { $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "item-group");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-level-${props.data.level}`]: true,
      [`${classNamePrefix}-disabled`]: props.data.disabled
    };
    classes.elContent = `${classNamePrefix}-content`;

    // render
    return (
      <div class={classes.el}>
        <div class={classes.elContent}>{props.data.label}</div>
      </div>
    );
  }
};