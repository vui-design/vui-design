import VuiLazyRender from "../../lazy-render";
import VuiIcon from "../../icon";
import VuiDropdownMenu from "../../dropdown-menu";
import Portal from "../../../directives/portal";
import Popup from "../../../libs/popup";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import guid from "../../../utils/guid";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiDropdownSubmenu = {
  name: "vui-dropdown-submenu",
  provide() {
    return {
      vuiDropdownSubmenu: this
    };
  },
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
    VuiLazyRender,
    VuiIcon,
    VuiDropdownMenu
  },
  directives: {
    Portal
  },
  props: {
    classNamePrefix: PropTypes.string,
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(() => guid()),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(() => guid()),
    icon: PropTypes.string,
    title: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool.def(false),
    animation: PropTypes.string.def("vui-dropdown-submenu-body-scale"),
    getPopupContainer: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(() => document.body)
  },
  data() {
    const state = {
      visible: false
    };

    return {
      state
    };
  },
  methods: {
    open(eventType, forceOpenParent) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.timeout && clearTimeout(this.timeout);
      this.state.visible = true;

      if (forceOpenParent) {
        if (this.vuiDropdownSubmenu) {
          this.vuiDropdownSubmenu.open(eventType, forceOpenParent);
        }
        else if (this.vuiDropdown) {
          this.vuiDropdown.open(eventType);
        }
      }
    },
    close(eventType, forceCloseParent) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.timeout && clearTimeout(this.timeout);

      const callback = () => {
        this.state.visible = false;
      };

      if (eventType === "select") {
        callback();
      }
      else {
        this.timeout = setTimeout(callback, 100);
      }

      if (forceCloseParent) {
        if (this.vuiDropdownSubmenu) {
          this.vuiDropdownSubmenu.close(eventType, forceCloseParent);
        }
        else if (this.vuiDropdown) {
          this.vuiDropdown.close(eventType);
        }
      }
    },
    register() {
      if (is.server) {
        return;
      }

      if (this.popup) {
        this.popup.update();
      }
      else {
        const { $refs: references, $props: props } = this;
        const reference = references.header;
        const target = references.body;
        const settings = {
          placement: "right-start",
          modifiers: {
            offset: {
              offset: [0, -4]
            }
          }
        };

        if (!reference || !target || !settings.placement) {
          return;
        }

        this.popup = new Popup(reference, target, settings);
        this.popup.target.style.zIndex = Popup.nextZIndex();
      }
    },
    unregister() {
      if (is.server) {
        return;
      }

      if (this.popup) {
        this.popup.destroy();
        this.popup = null;
      }
    },
    handleHeaderMouseenter(e) {
      this.open("hover", false);
    },
    handleHeaderMouseleave(e) {
      this.close("hover", false);
    },
    handleBodyMouseenter(e) {
      this.open("hover", true);
    },
    handleBodyMouseleave(e) {
      this.close("hover", true);
    },
    handleBodyBeforeEnter(el) {
      this.$nextTick(() => this.register());
    },
    handleBodyAfterLeave(el) {
      this.$nextTick(() => this.unregister());
    },
  },
  render(h) {
    const { vuiDropdownMenu, $slots: slots, $props: props, state } = this;
    const { $props: vuiDropdownMenuProps } = vuiDropdownMenu;
    const { handleHeaderMouseenter, handleHeaderMouseleave, handleBodyMouseenter, handleBodyMouseleave, handleBodyBeforeEnter, handleBodyAfterLeave } = this;

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
    const classNamePrefix = getClassNamePrefix(props.lassNamePrefix, "dropdown-submenu");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-open`]: state.visible,
      [`${classNamePrefix}-disabled`]: props.disabled
    };
    classes.elHeader = `${classNamePrefix}-header`;
    classes.elHeaderIcon = `${classNamePrefix}-header-icon`;
    classes.elHeaderTitle = `${classNamePrefix}-header-title`;
    classes.elHeaderArrow = `${classNamePrefix}-header-arrow`;
    classes.elBody = `${classNamePrefix}-body`;

    // render
    return (
      <div class={classes.el}>
        <div ref="header" class={classes.elHeader} onMouseenter={handleHeaderMouseenter} onMouseleave={handleHeaderMouseleave}>
          {
            icon ? (
              <div class={classes.elHeaderIcon}>{icon}</div>
            ) : null
          }
          {
            title ? (
              <div class={classes.elHeaderTitle}>{title}</div>
            ) : null
          }
          <div class={classes.elHeaderArrow}></div>
        </div>
        <VuiLazyRender render={state.visible}>
          <transition appear name={props.animation} onBeforeEnter={handleBodyBeforeEnter} onAfterLeave={handleBodyAfterLeave}>
            <div ref="body" v-portal={props.getPopupContainer} v-show={state.visible} class={classes.elBody} onMouseenter={handleBodyMouseenter} onMouseleave={handleBodyMouseleave}>
              <VuiDropdownMenu classNamePrefix={props.classNamePrefix} color={vuiDropdownMenuProps.color} width={props.width}>
                {slots.default}
              </VuiDropdownMenu>
            </div>
          </transition>
        </VuiLazyRender>
      </div>
    );
  }
};

export default VuiDropdownSubmenu;