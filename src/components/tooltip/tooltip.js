import VuiLazyRender from "../lazy-render";
import VuiResizeObserver from "../resize-observer";
import Portal from "../../directives/portal";
import Outclick from "../../directives/outclick";
import Popup from "../../libs/popup";
import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import getElementByEvent from "../../utils/getElementByEvent";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

const colors = ["dark", "light", "blue", "cyan", "geekblue", "gold", "green", "lime", "magenta", "orange", "pink", "purple", "red", "volcano", "yellow"];

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    trigger: PropTypes.oneOf(["hover", "focus", "click", "always"]).def("hover"),
    visible: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    color: PropTypes.string.def("dark"),
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    placement: PropTypes.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"]).def("top"),
    animation: PropTypes.string.def("vui-tooltip-popup-scale"),
    getPopupContainer: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element, PropTypes.func]).def(() => document.body),
    beforeOpen: PropTypes.func,
    beforeClose: PropTypes.func
  };
};

export default {
  name: "vui-tooltip",
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
    event: "input"
  },
  props: createProps(),
  data() {
    const { $props: props } = this;
    const state = {
      visible: props.trigger === "always" ? true : props.visible
    };

    return {
      state
    };
  },
  watch: {
    visible(value) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.state.visible = props.trigger === "always" ? true : value;
    }
  },
  methods: {
    toggle(visible) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      const callback = () => {
        this.state.visible = visible;
        this.$emit("input", visible);
        this.$emit("change", visible);
      };
      const beforeCallback = visible ? props.beforeOpen : props.beforeClose;
      let hook = true;

      if (is.function(beforeCallback)) {
        hook = beforeCallback();
      }

      if (is.promise(hook)) {
        hook.then(() => callback()).catch(error => {});
      }
      else if (is.boolean(hook) && hook === false) {
        return;
      }
      else {
        callback();
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
    handleMouseenter(e) {
      const { $props: props } = this;

      if (props.trigger === "hover") {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.toggle(true), 100);
      }
    },
    handleMouseleave(e) {
      const { $props: props } = this;

      if (props.trigger === "hover") {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.toggle(false), 100);
      }
    },
    handleFocusin(e) {
      const { $props: props } = this;

      if (props.trigger === "focus") {
        this.toggle(true);
      }
    },
    handleFocusout(e) {
      const { $props: props } = this;

      if (props.trigger === "focus") {
        this.toggle(false);
      }
    },
    handleClick(e) {
      const { $props: props, state } = this;

      if (props.trigger === "click") {
        this.toggle(!state.visible);
      }
    },
    handleOutClick(e) {
      const { $props: props } = this;

      if (props.trigger === "click") {
        const { $refs: references } = this;
        const element = getElementByEvent(e);

        if (!element || !references.popup || references.popup === element || references.popup.contains(element)) {
          return;
        }

        this.toggle(false);
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
    const { handleMouseenter, handleMouseleave, handleFocusin, handleFocusout, handleClick, handleOutClick, handleBeforeEnter, handleEnter, handleAfterEnter, handleBeforeLeave, handleLeave, handleAfterLeave, handleResize } = this;

    // color
    const withPresetColor = props.color && colors.indexOf(props.color) > -1;
    const withCustomColor = props.color && colors.indexOf(props.color) === -1;

    // maxWidth
    let maxWidth;

    if (props.maxWidth) {
      maxWidth = is.string(props.maxWidth) ? props.maxWidth : `${props.maxWidth}px`;
    }

    // content
    const content = slots.content || props.content;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "tooltip");
    let classes = {};

    classes.el = `${classNamePrefix}`;
    classes.elTrigger = `${classNamePrefix}-trigger`;
    classes.elPopup = {
      [`${classNamePrefix}-popup`]: true,
      [`${classNamePrefix}-popup-${props.color}`]: withPresetColor
    };
    classes.elPopupBody = `${classNamePrefix}-popup-body`;
    classes.elPopupArrow = `${classNamePrefix}-popup-arrow`;

    // style
    let styles = {};

    styles.elPopup = {
      maxWidth: maxWidth,
      backgroundColor: withCustomColor && props.color
    };
    styles.elPopupBody = {
      color: withCustomColor ?`#fff` : undefined
    };
    styles.elPopupArrow = {
      backgroundColor: withCustomColor && props.color
    };

    // render
    return (
      <div class={classes.el}>
        <div ref="trigger" class={classes.elTrigger} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave} onFocusin={handleFocusin} onFocusout={handleFocusout} onClick={handleClick} v-outclick={handleOutClick}>
          {slots.default}
        </div>
        <VuiLazyRender render={state.visible}>
          <VuiResizeObserver onResize={handleResize}>
            <transition appear name={props.animation} onBeforeEnter={handleBeforeEnter} onEnter={handleEnter} onAfterEnter={handleAfterEnter} onBeforeLeave={handleBeforeLeave} onLeave={handleLeave} onAfterLeave={handleAfterLeave}>
              <div ref="popup" v-portal={props.getPopupContainer} v-show={state.visible} class={classes.elPopup} style={styles.elPopup} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave}>
                <div class={classes.elPopupBody} style={styles.elPopupBody}>{content}</div>
                <div class={classes.elPopupArrow} style={styles.elPopupArrow}></div>
              </div>
            </transition>
          </VuiResizeObserver>
        </VuiLazyRender>
      </div>
    );
  }
};