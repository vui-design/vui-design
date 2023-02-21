import VuiIcon from "../icon";
import MixinLink from "../../mixins/link";
import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  };
};

export default {
  name: "vui-breadcrumb-item",
  inject: {
    vuiBreadcrumb: {
      default: undefined
    }
  },
  components: {
    VuiIcon
  },
  mixins: [
    MixinLink
  ],
  props: createProps(),
  render() {
    const { vuiBreadcrumb, $slots: slots, $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "breadcrumb-item");
    let classes = {};

    classes.el = `${classNamePrefix}`;
    classes.elLink = `${classNamePrefix}-link`;
    classes.elSeparator = `${classNamePrefix}-separator`;

    // icon
    let icon;

    if (slots.icon) {
      icon = slots.icon;
    }
    else if (props.icon) {
      icon = (
        <VuiIcon type={props.icon} />
      );
    }

    // title
    let title;

    if (slots.default) {
      title = slots.default;
    }
    else if (props.title) {
      title = props.title;
    }

    // render
    let children = [];

    if (props.href || props.to) {
      let attributes = {
        attrs: {
          target: props.target
        },
        class: classes.elLink,
        on: {
          click: this.handleLinkClick
        }
      };

      if (props.href) {
        attributes.attrs.href = props.href;
      }
      else {
        const route = this.getNextRoute();

        attributes.attrs.href = route.href;
      }

      children.push(
        <a {...attributes}>{icon}{title}</a>
      );
    }
    else {
      children.push(
        <label class={classes.elLink}>{icon}{title}</label>
      );
    }

    children.push(
      <div class={classes.elSeparator}>{vuiBreadcrumb.separator}</div>
    );

    return (
      <div class={classes.el}>{children}</div>
    );
  }
};