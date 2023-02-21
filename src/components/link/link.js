import VuiIcon from "../icon";
import Link from "../../mixins/link";
import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    type: PropTypes.oneOf(["default", "primary", "info", "warning", "success", "danger"]).def("default"),
    icon: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large"]).def("medium"),
    block: PropTypes.bool.def(false),
    underline: PropTypes.bool.def(false),
    loading: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false)
  };
};

export default {
  name: "vui-link",
  components: {
    VuiIcon
  },
  mixins: [
    Link
  ],
  inheritAttrs: false,
  props: createProps(),
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
    }
  },
  render() {
    const { $slots: slots, $props: props, $attrs: attrs, $listeners: listeners } = this;
    const { insertTextIntoSpan, getNextRoute, handleLinkClick } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "link");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.type}`]: props.type,
      [`${classNamePrefix}-${props.size}`]: props.size,
      [`${classNamePrefix}-block`]: props.block,
      [`${classNamePrefix}-underline`]: props.underline,
      [`${classNamePrefix}-loading`]: props.loading,
      [`${classNamePrefix}-disabled`]: props.disabled
    };

    // render
    let children = [];

    if (props.loading) {
      children.push(
        <VuiIcon type="loading" />
      );
    }
    else if (slots.icon) {
      children.push(slots.icon);
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
        ...attrs
      },
      class: classes.el
    };

    if (!props.loading && !props.disabled) {
      attributes.on = {
        ...listeners,
        click: handleLinkClick
      };

      if (props.href) {
        attributes.attrs.href = props.href;
      }
      else if (props.to) {
        const route = getNextRoute();

        attributes.attrs.href = route.href;
      }

      attributes.attrs.target = props.target;
    }

    return (
      <a {...attributes}>{children}</a>
    );
  }
};