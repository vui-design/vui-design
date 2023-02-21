import VuiLazyRender from "../lazy-render";
import VuiResizeObserver from "../resize-observer";
import Portal from "../../directives/portal";
import Outclick from "../../directives/outclick";
import Popup from "../../libs/popup";
import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import getStyle from "../../utils/getStyle";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    trigger: PropTypes.oneOf(["hover", "click"]).def("hover"),
    visible: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    placement: PropTypes.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"]).def("bottom-start"),
    dropdownAutoWidth: PropTypes.bool.def(true),
    animation: PropTypes.string.def("vui-dropdown-popup-scale"),
    getPopupContainer: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element, PropTypes.func]).def(() => document.body)
  };
};

export default {
  name: "vui-dropdown",
  provide() {
    return {
      vuiDropdown: this
    };
  },
  components: {
    VuiLazyRender,
    VuiResizeObserver
  },
  directives: {
    Portal,
    Outclick
  },
  model: {
    prop: "visible",
    event: "change"
  },
  props: createProps(),
  data() {
    const { $props: props } = this;
    const state = {
    	visible: props.visible
    };

    return {
      state
    };
  },
  watch: {
    visible(value) {
      this.state.visible = value;
    }
  },
  methods: {
    open(eventType) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.timeout && clearTimeout(this.timeout);

      if (this.state.visible) {
        return;
      }

      this.state.visible = true;
      this.$emit("change", this.state.visible);
    },
    close(eventType) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      if (props.trigger === "click" && eventType === "hover") {
        return;
      }

      this.timeout && clearTimeout(this.timeout);

      const callback = () => {
        if (!this.state.visible) {
          return;
        }

        this.state.visible = false;
        this.$emit("change", this.state.visible);
      };

      if (eventType === "click") {
        callback();
      }
      else {
        this.timeout = setTimeout(callback, 100);
      }
    },
    register() {
      if (is.server || this.popup) {
        return;
      }

      const { $refs: references, $props: props } = this;
      const reference = references.trigger;
      const target = references.popup;
      const settings = {
        placement: props.placement
      };

      if (!reference || !target || !settings.placement) {
        return;
      }

      let width = "";

      if (!props.dropdownAutoWidth) {
        width = getStyle(reference, "width");
      }

      this.popup = new Popup(reference, target, settings);
      this.popup.target.style.zIndex = Popup.nextZIndex();
      this.popup.target.style.width = width;
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
    handleMouseenter(e) {
      const { $props: props } = this;

      if (props.trigger === "hover") {
        this.open("hover");
      }
    },
    handleMouseleave(e) {
      const { $props: props } = this;

      if (props.trigger === "hover") {
        this.close("hover");
      }
    },
    handleClick(e) {
      const { $props: props, state } = this;

      if (props.trigger === "click") {
        state.visible ? this.close("click") : this.open("click");
      }
    },
    handleOutClick(e) {
      const { $props: props } = this;

      if (props.trigger === "click") {
        const isChildren = function(component, targetElement) {
          return component.$children.some(child => {
            if (child.$el === targetElement || child.$el.contains(targetElement) || (child.$refs && child.$refs.popup && (child.$refs.popup === targetElement || child.$refs.popup.contains(targetElement)))) {
              return true;
            }
            else if (child.$children && isChildren(child, targetElement)) {
              return true;
            }

            return false;
          });
        };

        if (isChildren(this, e.target)) {
          return;
        }

        this.close("click");
      }
    },
    handleBeforeEnter() {
      this.$nextTick(() => this.register());
      this.$emit("beforeOpen");
    },
    handleEnter() {
      this.$emit("open");
    },
    handleAfterEnter() {
      this.$emit("afterOpen");
    },
    handleBeforeLeave() {
      this.$emit("beforeClose");
    },
    handleLeave() {
      this.$emit("close");
    },
    handleAfterLeave() {
      this.$nextTick(() => this.unregister());
      this.$emit("afterClose");
    },
    handleResize() {
      this.$nextTick(() => this.reregister());
    }
  },
  render() {
    const { $slots: slots, $props: props, state } = this;
    const { handleMouseenter, handleMouseleave, handleClick, handleOutClick, handleBeforeEnter, handleEnter, handleAfterEnter, handleBeforeLeave, handleLeave, handleAfterLeave, handleResize } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown");
    let classes = {};

    classes.el = `${classNamePrefix}`;
    classes.elTrigger = `${classNamePrefix}-trigger`;
    classes.elPopup = `${classNamePrefix}-popup`;

    // render
    return (
      <div class={classes.el} v-outclick={handleOutClick}>
        <div ref="trigger" class={classes.elTrigger} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave} onClick={handleClick}>
          {slots.default}
        </div>
        <VuiLazyRender render={state.visible}>
          <VuiResizeObserver onResize={handleResize}>
            <transition appear name={props.animation} onBeforeEnter={handleBeforeEnter} onAfterLeave={handleAfterLeave}>
              <div ref="popup" v-portal={props.getPopupContainer} v-show={state.visible} class={classes.elPopup} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave}>
                {slots.menu}
              </div>
            </transition>
          </VuiResizeObserver>
        </VuiLazyRender>
      </div>
    );
  }
};