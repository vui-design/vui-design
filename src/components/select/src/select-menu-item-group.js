import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiSelectMenuItemGroup = {
  name: "vui-select-menu-item-group",
  inject: {
    vuiSelect: {
      default: undefined
    },
    vuiSelectDropdown: {
      default: undefined
    },
    vuiSelectMenu: {
      default: undefined
    }
  },
  props: {
    classNamePrefix: PropTypes.string,
    data: PropTypes.object.def({})
  },
  render(h) {
    const { $slots: slots, $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "item-group");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-disabled`]: props.data.disabled
    };
    classes.elHeader = `${classNamePrefix}-header`;
    classes.elBody = `${classNamePrefix}-body`;

    // render
    return (
      <div class={classes.el}>
        <div class={classes.elHeader}>{props.data.label}</div>
        <div class={classes.elBody}>{slots.default}</div>
      </div>
    );
  }
};

export default VuiSelectMenuItemGroup;