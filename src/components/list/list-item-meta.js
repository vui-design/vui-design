import VuiAvatar from "../avatar";
import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    avatar: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
  };
};

export default {
  name: "vui-list-item-meta",
  components: {
    VuiAvatar
  },
  props: createProps(),
  render(h) {
    const { $slots: slots, $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "list-item-meta");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true
    };
    classes.elAvatar = `${classNamePrefix}-avatar`;
    classes.elContent = `${classNamePrefix}-content`;
    classes.elTitle = `${classNamePrefix}-title`;
    classes.elDescription = `${classNamePrefix}-description`;

    // avatar
    let avatar;

    if (slots.avatar) {
      avatar = slots.avatar;
    }
    else if (props.avatar) {
      avatar = (
        <VuiAvatar src={props.avatar} />
      );
    }

    // render
    let children = [];

    if (avatar) {
      children.push(
        <div class={classes.elAvatar}>
          {avatar}
        </div>
      );
    }

    children.push(
      <div class={classes.elContent}>
        <div class={classes.elTitle}>{slots.title || props.title}</div>
        <div class={classes.elDescription}>{slots.description || props.description}</div>
      </div>
    );

    return (
      <div class={classes.el}>
        {children}
      </div>
    );
  }
};