import VuiIcon from "../icon";
import MixinLink from "../../mixins/link";
import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    extra: PropTypes.string,
    selected: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false)
  };
};

export default {
  name: "vui-cell",
  inject: {
    vuiCellGroup: {
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
  methods: {
    handleCellClick(e) {
      this.$emit("click", e);
    }
  },
  render(h) {
    const { $slots: slots, $props: props, $attrs: attrs, $listeners: listeners } = this;
    const { getNextRoute } = this;
    const { handleCellClick, handleLinkClick } = this;

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

    // content
    const content = slots.default || props.title;

    // extra
    const extra = slots.extra || props.extra;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "cell");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-link`]: props.href || props.to,
      [`${classNamePrefix}-selected`]: props.selected,
      [`${classNamePrefix}-disabled`]: props.disabled
    };
    classes.elIcon = `${classNamePrefix}-icon`;
    classes.elContent = `${classNamePrefix}-content`;
    classes.elExtra = `${classNamePrefix}-extra`;
    classes.elCheckmark = `${classNamePrefix}-checkmark`;
    classes.elArrow = `${classNamePrefix}-arrow`;

    // render
    let children = [];

    if (icon) {
      children.push(
        <div class={classes.elIcon}>{icon}</div>
      );
    }

    children.push(
      <div class={classes.elContent}>{content}</div>
    );

    if (extra) {
      children.push(
        <div class={classes.elExtra}>{extra}</div>
      );
    }

    if (props.selected) {
      children.push(
        <div class={classes.elCheckmark}>
          <VuiIcon type="checkmark" />
        </div>
      );
    }
    else if (props.href || props.to) {
      children.push(
        <div class={classes.elArrow}>
          <VuiIcon type="chevron-right" />
        </div>
      );
    }

    let attributes = {
      attrs: {
        ...attrs
      },
      class: classes.el,
      on: {
        ...listeners
      }
    };

    if (!props.href && !props.to) {
      attributes.on.click = handleCellClick;

      return (
        <div {...attributes}>{children}</div>
      );
    }
    else {
      if (props.href) {
        attributes.attrs.href = props.href;
      }
      else {
        const route = getNextRoute();

        attributes.attrs.href = route.href;
      }

      attributes.attrs.target = props.target;
      attributes.on.click = handleLinkClick;

      return (
        <a {...attributes}>{children}</a>
      );
    }
  }
};