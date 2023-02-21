import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    title: PropTypes.string
  };
};

export default {
  name: "vui-form-group",
  props: createProps(),
  render() {
    const { $slots: slots, $props: props } = this;

    // title
    const title = slots.title || props.title;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "form-group");
    let classes = {};

    classes.el = `${classNamePrefix}`;
    classes.elTitle = `${classNamePrefix}-title`;

    // render
    return (
      <fieldset class={classes.el}>
        <legend class={classes.elTitle}>{title}</legend>
        {slots.default}
      </fieldset>
    );
  }
};