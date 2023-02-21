import VuiLazyRender from "../lazy-render";
import VuiResizeObserver from "../resize-observer";
import VuiIcon from "../icon";
import Portal from "../../directives/portal";
import Popup from "../../libs/popup";
import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    // TODO 将在后续版本中移除，请使用 value 属性替代
    name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    icon: PropTypes.string,
    title: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    disabled: PropTypes.bool.def(false),
    animation: PropTypes.string.def("vui-dropdown-submenu-body-scale"),
    getPopupContainer: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element, PropTypes.func]).def(() => document.body)
  };
};

export default {
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
    VuiResizeObserver,
    VuiIcon
  },
  directives: {
    Portal
  },
  props: createProps(),
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

      if (eventType === "click") {
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
      if (is.server || this.popup) {
        return;
      }

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
    },
    reregister() {
      if (is.server || !this.popup) {
        return;
      }

      this.popup.update();
    },
    unregister() {
      if (is.server || !this.popup) {
        return;
      }

      this.popup.destroy();
      this.popup = null;
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
    handleResize() {
      this.$nextTick(() => this.reregister());
    }
  },
  render(h) {
    const { vuiDropdownMenu, $slots: slots, $props: props, state } = this;
    const { $props: vuiDropdownMenuProps } = vuiDropdownMenu;
    const { handleHeaderMouseenter, handleHeaderMouseleave, handleBodyMouseenter, handleBodyMouseleave, handleBodyBeforeEnter, handleBodyAfterLeave, handleResize } = this;

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
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown-submenu");
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

    const menuClassNamePrefix = getClassNamePrefix(vuiDropdownMenuProps.classNamePrefix, "dropdown-menu");
    const menuColor = vuiDropdownMenuProps.color;

    classes.elMenu = {
      [`${menuClassNamePrefix}`]: true,
      [`${menuClassNamePrefix}-${menuColor}`]: menuColor
    };

    // style
    let styles = {};

    if (props.width) {
      styles.elMenu = {
        width: is.string(props.width) ? props.width : `${props.width}px`
      };
    }

    // render
    return (
      <div class={classes.el}>
        <div ref="header" class={classes.elHeader} onMouseenter={handleHeaderMouseenter} onMouseleave={handleHeaderMouseleave}>
          {
            icon ? (
              <div class={classes.elHeaderIcon}>{icon}</div>
            ) : null
          }
          <div class={classes.elHeaderTitle}>{title}</div>
          <div class={classes.elHeaderArrow}></div>
        </div>
        <VuiLazyRender render={state.visible}>
          <VuiResizeObserver onResize={handleResize}>
            <transition appear name={props.animation} onBeforeEnter={handleBodyBeforeEnter} onAfterLeave={handleBodyAfterLeave}>
              <div ref="body" v-portal={props.getPopupContainer} v-show={state.visible} class={classes.elBody} onMouseenter={handleBodyMouseenter} onMouseleave={handleBodyMouseleave}>
                <div class={classes.elMenu} style={styles.elMenu}>{slots.default}</div>
              </div>
            </transition>
          </VuiResizeObserver>
        </VuiLazyRender>
      </div>
    );
  }
};