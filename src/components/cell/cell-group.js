import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  };
};

export default {
  name: "vui-cell-group",
  provide() {
    return {
      vuiCellGroup: this
    };
  },
  props: createProps(),
  render(h) {
    const { $slots: slots, $props: props } = this;

    // title
    const title = slots.title || props.title;

    // description
    const description = slots.description || props.description;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "cell-group");
    let classes = {};

    classes.el = `${classNamePrefix}`;
    classes.elTitle = `${classNamePrefix}-title`;
    classes.elDescription = `${classNamePrefix}-description`;

    // render
    let children = [];

    if (title) {
      children.push(
        <div class={classes.elTitle}>{title}</div>
      );
    }

    children.push(slots.default);

    if (description) {
      children.push(
        <div class={classes.elDescription}>{description}</div>
      );
    }

    return (
      <div class={classes.el}>{children}</div>
    );
  }
};