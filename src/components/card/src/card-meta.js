import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiCardMeta = {
  name: "vui-card-meta",
  props: {
    classNamePrefix: PropTypes.string,
    avatar: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  },
  render(h) {
    const { $slots: slots, $props: props } = this;

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

    // title
    const title = slots.title || props.title;

    // description
    const description = slots.description || props.description;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "card-meta");
    let classes = {};

    classes.el = `${classNamePrefix}`;
    classes.elAvatar = `${classNamePrefix}-avatar`;
    classes.elDetail = `${classNamePrefix}-detail`;
    classes.elTitle = `${classNamePrefix}-title`;
    classes.elDescription = `${classNamePrefix}-description`;

    // render
    return (
      <div class={classes.el}>
        {
          avatar && (
            <div class={classes.elAvatar}>{avatar}</div>
          )
        }
        <div class={classes.elDetail}>
          <div class={classes.elTitle}>{title}</div>
          <div class={classes.elDescription}>{description}</div>
        </div>
      </div>
    );
  }
};

export default VuiCardMeta;