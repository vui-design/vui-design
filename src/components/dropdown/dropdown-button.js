import VuiIcon from "../icon";
import VuiButton from "../button";
import VuiDropdown from "../dropdown";
import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["default", "primary", "info", "warning", "success", "error", "dashed", "text"]).def("default"),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    icon: PropTypes.string.def("more-x"),
    visible: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    trigger: PropTypes.oneOf(["hover", "click"]).def("hover"),
    placement: PropTypes.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"]).def("bottom-end"),
    dropdownAutoWidth: PropTypes.bool.def(true),
    animation: PropTypes.string.def("vui-dropdown-popup-scale"),
    getPopupContainer: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.element, PropTypes.func]).def(() => document.body)
  };
};

export default {
  name: "vui-dropdown-button",
  components: {
    VuiIcon,
    VuiButton,
    VuiDropdown
  },
  provide() {
    return {
      vuiDropdownButton: this
    };
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
    handleClick(e) {
      this.$emit("click", e);
    },
    handleChange(visible) {
      this.state.visible = visible;
      this.$emit("change", visible);
    },
    handleBeforeOpen() {
      this.$emit("beforeOpen");
    },
    handleOpen() {
      this.$emit("open");
    },
    handleAfterOpen() {
      this.$emit("afterOpen");
    },
    handleBeforeClose() {
      this.$emit("beforeClose");
    },
    handleClose() {
      this.$emit("close");
    },
    handleAfterClose() {
      this.$emit("afterClose");
    }
  },
  render() {
    const { $slots: slots, $props: props, state } = this;
    const { handleClick, handleChange, handleBeforeOpen, handleOpen, handleAfterOpen, handleBeforeClose, handleClose, handleAfterClose } = this;

    // icon
    let icon;

    if (slots.icon) {
      icon = slots.icon;
    }
    else {
      icon = (
        <VuiIcon type={props.icon} />
      );
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown-button");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    // style
    let styles = {}

    styles.elDropdown = {
      marginLeft: props.type === "default" || props.type === "dashed" || props.type === "test" ? "-1px" : "1px"
    };

    // render
    return (
      <div class={classes.el}>
        <VuiButton type={props.type} size={props.size} disabled={props.disabled} onClick={handleClick}>{slots.default}</VuiButton>
        <VuiDropdown
          visible={state.visible}
          disabled={props.disabled}
          trigger={props.trigger}
          placement={props.placement}
          dropdownAutoWidth={props.dropdownAutoWidth}
          animation={props.animation}
          getPopupContainer={props.getPopupContainer}
          style={styles.elDropdown}
          onChange={handleChange}
          onBeforeOpen={handleBeforeOpen}
          onOpen={handleOpen}
          onAfterOpen={handleAfterOpen}
          onBeforeClose={handleBeforeClose}
          onClose={handleClose}
          onAfterClose={handleAfterClose}
        >
          <VuiButton type={props.type} size={props.size} block disabled={props.disabled}>{icon}</VuiButton>
          <div slot="menu">{slots.menu}</div>
        </VuiDropdown>
      </div>
    );
  }
};