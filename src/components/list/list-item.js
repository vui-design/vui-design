import PropTypes from "../../utils/prop-types";
import getValidElements from "../../utils/getValidElements";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string
  };
};

export default {
  name: "vui-list-item",
  inject: {
    vuiList: {
      default: undefined
    }
  },
  props: createProps(),
  render(h) {
    const { vuiList, $slots: slots, $props: props } = this;
    const { $props: vuiListProps } = vuiList;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "list-item");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true
    };
    classes.elMain = `${classNamePrefix}-main`;
    classes.elActions = `${classNamePrefix}-actions`;
    classes.elAction = `${classNamePrefix}-action`;
    classes.elActionDivider = `${classNamePrefix}-action-divider`;
    classes.elExtra = `${classNamePrefix}-extra`;

    // actions
    let actions = [];
    let elements = getValidElements(slots.actions);

    elements.forEach((element, index) => {
      if (index > 0) {
        actions.push(
          <i class={classes.elActionDivider} />
        );
      }

      actions.push(
        <div class={classes.elAction}>{element}</div>
      );
    });

    // render
    let children = [];

    if (vuiListProps.layout === "vertical") {
      children.push(
        <div class={classes.elMain}>
          {slots.default}
          {
            actions.length > 0 && (
              <div class={classes.elActions}>
                {actions}
              </div>
            )
          }
        </div>
      );
    }
    else {
      children.push(slots.default);

      if (actions.length > 0) {
        children.push(
          <div class={classes.elActions}>
            {actions}
          </div>
        );
      }
    }

    if (slots.extra) {
      children.push(
        <div class={classes.elExtra}>
          {slots.extra}
        </div>
      );
    }

    return (
      <div class={classes.el}>
        {children}
      </div>
    );
  }
};