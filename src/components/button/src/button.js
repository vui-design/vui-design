import VuiIcon from "vui-design/components/icon";
import Link from "vui-design/mixins/link";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiButton = {
  name: "vui-button",
  inject: {
    vuiForm: {
      default: undefined
    },
    vuiInputGroup: {
      default: undefined
    },
    vuiButtonGroup: {
      default: undefined
    }
  },
  components: {
    VuiIcon
  },
  mixins: [
    Link
  ],
  inheritAttrs: false,
  props: {
    classNamePrefix: PropTypes.string,
    htmlType: PropTypes.oneOf(["button", "submit", "reset"]).def("button"),
    type: PropTypes.oneOf(["default", "primary", "info", "warning", "success", "error", "dashed", "text"]).def("default"),
    block: PropTypes.bool.def(false),
    ghost: PropTypes.bool.def(false),
    shape: PropTypes.oneOf(["round", "circle"]),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    loading: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    icon: PropTypes.string
  },
  methods: {
    insertTextIntoSpan(element) {
      if (is.string(element.text)) {
        return (
          <span>{element.text.trim()}</span>
        );
      }
      else {
        return element;
      }
    },
    handleButtonClick(e) {
      this.$emit("click", e);
    }
  },
  render() {
    const { $vui: vui, vuiForm, vuiInputGroup, vuiButtonGroup } = this;
    const { $slots: slots, $props: props, $attrs: attrs, $listeners: listeners } = this;
    const { insertTextIntoSpan, getNextRoute, handleButtonClick, handleLinkClick } = this;

    // type
    let type;

    if (vuiButtonGroup) {
      type = vuiButtonGroup.type;
    }
    else {
      type = props.type;
    }

    // shape
    let shape;

    if (vuiButtonGroup) {
      shape = vuiButtonGroup.shape;
    }
    else {
      shape = props.shape;
    }

    // size
    let size;

    if (props.size) {
      size = props.size;
    }
    else if (vuiButtonGroup && vuiButtonGroup.size) {
      size = vuiButtonGroup.size;
    }
    else if (vuiInputGroup && vuiInputGroup.size) {
      size = vuiInputGroup.size;
    }
    else if (vuiForm && vuiForm.size) {
      size = vuiForm.size;
    }
    else if (vui && vui.size) {
      size = vui.size;
    }
    else {
      size = "medium";
    }

    // disabled
    let disabled;

    if (vuiForm && vuiForm.disabled) {
      disabled = vuiForm.disabled;
    }
    else if (vuiInputGroup && vuiInputGroup.disabled) {
      disabled = vuiInputGroup.disabled;
    }
    else if (vuiButtonGroup && vuiButtonGroup.disabled) {
      disabled = vuiButtonGroup.disabled;
    }
    else {
      disabled = props.disabled;
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "button");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${type}`]: type,
      [`${classNamePrefix}-block`]: props.block,
      [`${classNamePrefix}-ghost`]: props.ghost,
      [`${classNamePrefix}-${shape}`]: shape,
      [`${classNamePrefix}-${size}`]: size,
      [`${classNamePrefix}-loading`]: props.loading,
      [`${classNamePrefix}-disabled`]: disabled
    };

    // render
    let children = [];

    if (props.loading) {
      children.push(
        <VuiIcon type="loading" />
      );
    }
    else if (props.icon) {
      children.push(
        <VuiIcon type={props.icon} />
      );
    }

    if (slots.default) {
      slots.default.forEach(element => children.push(insertTextIntoSpan(element)));
    }

    let attributes = {
      attrs: {
        ...attrs,
        disabled
      },
      class: classes.el,
      on: {
        ...listeners
      }
    };

    if (props.href || props.to) {
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
    else {
      attributes.attrs.type = props.htmlType;
      attributes.on.click = handleButtonClick;

      return (
        <button {...attributes}>{children}</button>
      );
    }
  }
};

export default VuiButton;