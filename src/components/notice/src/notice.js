import VuiIcon from "../../icon";
import Portal from "../../../directives/portal";
import Popup from "../../../libs/popup";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiNotice = {
  name: "vui-notice",
  components: {
    VuiIcon
  },
  directives: {
    Portal
  },
  model: {
    prop: "visible",
    event: "input"
  },
  props: {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["info", "warning", "success", "error"]).def("info"),
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
    icon: PropTypes.string,
    closable: PropTypes.bool.def(true),
    closeText: PropTypes.string,
    placement: PropTypes.oneOf(["top-left", "top-right", "bottom-left", "bottom-right"]).def("top-right"),
    top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(24),
    bottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(24),
    visible: PropTypes.bool.def(false),
    animation: PropTypes.string.def("vui-notice-fade"),
    getPopupContainer: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element, PropTypes.func]).def(() => document.body)
  },
  data() {
    const { $props: props } = this;
    const state = {
      visible: props.visible,
      zIndex: Popup.nextZIndex()
    };

    return {
      state
    };
  },
  watch: {
    visible(value) {
      if (this.state.visible === value) {
        return;
      }

      this.state.visible = value;

      if (!value) {
        return;
      }

      this.state.zIndex = Popup.nextZIndex();
    }
  },
  methods: {
    toggle(visible) {
      this.state.visible = visible;
      this.$emit("input", visible);
      this.$emit("change", visible);
    },
    open() {
      this.toggle(true);
    },
    close() {
      this.toggle(false);
    },
    handleClose() {
      this.close();
    },
    handleBeforeEnter() {
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
      this.$emit("afterClose");
    }
  },
  render(h) {
    const { $slots: slots, $props: props, state } = this;
    const { handleClose, handleBeforeEnter, handleEnter, handleAfterEnter, handleBeforeLeave, handleLeave, handleAfterLeave } = this;

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
      title = is.function(props.title) ? props.title(h) : props.title;
    }

    // description
    let description;

    if (slots.description) {
      description = slots.description;
    }
    else if (props.description) {
      description = is.function(props.description) ? props.description(h) : props.description;
    }

    // btnClose
    let btnClose;

    if (props.closable) {
      if (props.closeText) {
        btnClose = props.closeText;
      }
      else {
        btnClose = (
          <VuiIcon type="crossmark" />
        );
      }
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "notice");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.type}`]: props.type,
      [`${classNamePrefix}-with-icon`]: icon,
      [`${classNamePrefix}-with-description`]: description,
      [`${classNamePrefix}-closable`]: props.closable,
      [`${classNamePrefix}-${props.placement}`]: props.placement
    };
    classes.elIcon = `${classNamePrefix}-icon`;
    classes.elTitle = `${classNamePrefix}-title`;
    classes.elDescription = `${classNamePrefix}-description`;
    classes.elBtnClose = `${classNamePrefix}-btn-close`;

    // style
    let styles = {};

    styles.el = {
      zIndex: state.zIndex
    };

    if (/^(top)(-left|-right)?$/g.test(props.placement)) {
      styles.el.top = is.string(props.top) ? props.top : (props.top + "px");
    }
    else if (/^(bottom)(-left|-right)?$/g.test(props.placement)) {
      styles.el.bottom = is.string(props.bottom) ? props.bottom : (props.bottom + "px");
    }

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

    if (description) {
      children.push(
        <div class={classes.elDescription}>{description}</div>
      );
    }

    if (props.closable) {
      children.push(
        <div class={classes.elBtnClose} onClick={handleClose}>{btnClose}</div>
      );
    }

    return (
      <transition
        appear
        name={props.animation}
        onBeforeEnter={handleBeforeEnter}
        onEnter={handleEnter}
        onAfterEnter={handleAfterEnter}
        onBeforeLeave={handleBeforeLeave}
        onLeave={handleLeave}
        onAfterLeave={handleAfterLeave}
      >
        <div v-portal={props.getPopupContainer} v-show={state.visible} class={classes.el} style={styles.el}>
          {children}
        </div>
      </transition>
    );
  }
};

export default VuiNotice;