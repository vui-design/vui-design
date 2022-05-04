import VuiIcon from "../../icon";
import MixinLink from "../../../mixins/link";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import guardLinkEvent from "../../../utils/guardLinkEvent";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiDropdownMenuItem = {
  name: "vui-dropdown-menu-item",
  inject: {
    vuiDropdown: {
      default: undefined
    },
    vuiDropdownMenu: {
      default: undefined
    },
    vuiDropdownSubmenu: {
      default: undefined
    }
  },
  components: {
    VuiIcon
  },
  mixins: [
    MixinLink
  ],
  props: {
    classNamePrefix: PropTypes.string,
    // TODO 将在后续版本中移除，请使用 value 属性替代
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.string,
    title: PropTypes.string,
    danger: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false)
  },
  methods: {
    handleClick(e) {
      const { vuiDropdown, vuiDropdownMenu, vuiDropdownSubmenu, $router: router, $props: props, getNextRoute } = this;

      if (props.disabled) {
        return e.preventDefault();
      }

      let value = props.value;

      if (is.undefined(value)) {
        value = props.name;
      }

      vuiDropdownMenu.$emit("click", value);

      if (vuiDropdownSubmenu) {
        vuiDropdownSubmenu.close("click", true);
      }
      else if (vuiDropdown) {
        vuiDropdown.close("click");
      }

      if (props.href) {

      }
      else if (props.to && guardLinkEvent(e)) {
        try {
          const route = getNextRoute();
          const method = props.replace ? router.replace : router.push;
          const fallback = error => {};

          method.call(router, route.location).catch(fallback);
        }
        catch(error) {
          console.error(error);
        }
      }
    }
  },
  render(h) {
    const { $slots: slots, $props: props, getNextRoute } = this;
    const { handleClick } = this;

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
    const title = slots.title || props.title;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown-menu-item");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-danger`]: props.danger,
      [`${classNamePrefix}-disabled`]: props.disabled
    };
    classes.elIcon = `${classNamePrefix}-icon`;
    classes.elTitle = `${classNamePrefix}-title`;

    // render
    let children = [];

    if (icon) {
      children.push(
        <div class={classes.elIcon}>{icon}</div>
      );
    }

    if (title) {
      children.push(
        <div class={classes.elTitle}>{title}</div>
      );
    }

    if (props.href || props.to) {
      const route = getNextRoute();
      const linkProps = {
        attrs: {
          href: props.href || route.href,
          target: props.target
        },
        class: classes.el,
        on: {
          click: handleClick
        }
      };

      return (
        <a {...linkProps}>{children}</a>
      );
    }
    else {
      const buttonProps = {
        class: classes.el,
        on: {
          click: handleClick
        }
      };

      return (
        <div {...buttonProps}>{children}</div>
      );
    }
  }
};

export default VuiDropdownMenuItem;