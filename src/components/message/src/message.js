import VuiIcon from "../../icon";
import Portal from "../../../directives/portal";
import Popup from "../../../libs/popup";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiMessage = {
  name: "vui-message",
  components: {
    VuiIcon
  },
  directives: {
    Portal
  },
  model: {
    prop: "visible",
    event: "change"
  },
  props: {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["info", "warning", "success", "error", "loading"]).def("info"),
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
    icon: PropTypes.string,
    background: PropTypes.bool.def(false),
    closable: PropTypes.bool.def(false),
    closeText: PropTypes.string,
    top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(20),
    visible: PropTypes.bool.def(false),
    animation: PropTypes.string.def("vui-message-fade"),
    getPopupContainer: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(() => document.body),
  },
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
      if (this.state.visible === value) {
        return;
      }

      this.state.visible = value;
    }
  },
  methods: {
    open() {
      this.state.visible = true;
      this.$emit("change", this.state.visible);
    },
    close() {
      this.state.visible = false;
      this.$emit("change", this.state.visible);
    },
    handleBtnCloseClick() {
      this.close();
    },
    handleEnter() {
      this.$emit("open");
    },
    handleAfterEnter() {
      this.$emit("afterOpen");
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
    const { handleBtnCloseClick, handleEnter, handleAfterEnter, handleLeave, handleAfterLeave } = this;

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
    let content;

    if (slots.default) {
      content = slots.default;
    }
    else if (props.content) {
      content = is.function(props.content) ? props.content(h) : props.content;
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
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "message");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.type}`]: props.type,
      [`${classNamePrefix}-with-background`]: props.background,
      [`${classNamePrefix}-with-icon`]: icon,
      [`${classNamePrefix}-closable`]: props.closable
    };
    classes.elContent = `${classNamePrefix}-content`;
    classes.elIcon = `${classNamePrefix}-icon`;
    classes.elBtnClose = `${classNamePrefix}-btn-close`;

    // style
    let styles = {};

    styles.el = {
      top: is.string(props.top) ? props.top : (props.top + "px"),
      zIndex: state.visible ? Popup.nextZIndex() : Popup.zIndex
    };

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

    if (props.closable) {
      children.push(
        <div class={classes.elBtnClose} onClick={handleBtnCloseClick}>{btnClose}</div>
      );
    }

    return (
      <transition
        name={props.animation}
        onEnter={handleEnter}
        onAfterEnter={handleAfterEnter}
        onLeave={handleLeave}
        onAfterLeave={handleAfterLeave}
        appear
      >
        <div v-portal={props.getPopupContainer} v-show={state.visible} class={classes.el} style={styles.el}>
          {children}
        </div>
      </transition>
    );
  }
};

export default VuiMessage;
