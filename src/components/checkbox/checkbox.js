import Emitter from "../../mixins/emitter";
import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    indeterminate: PropTypes.bool.def(false),
    checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(false),
    disabled: PropTypes.bool.def(false),
    checkedValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(true),
    uncheckedValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(false),
    validator: PropTypes.bool.def(true)
  };
};

export default {
  name: "vui-checkbox",
  inject: {
    vuiForm: {
      default: undefined
    },
    vuiCheckboxGroup: {
      default: undefined
    },
    vuiChoiceGroup: {
      default: undefined
    }
  },
  mixins: [
    Emitter
  ],
  inheritAttrs: false,
  model: {
    prop: "checked",
    event: "input"
  },
  props: createProps(),
  data() {
    const { $props: props } = this;
    const state = {
      focused: false,
      checked: props.checked
    };

    return {
      state
    };
  },
  watch: {
    checked(value) {
      if (this.state.checked === value) {
        return;
      }

      this.state.checked = value;
    }
  },
  methods: {
    handleFocus(e) {
      this.state.focused = true;
      this.$emit("focus");
    },
    handleBlur(e) {
      this.state.focused = false;
      this.$emit("blur");
    },
    handleChange(e) {
      const { vuiCheckboxGroup, vuiChoiceGroup, $refs: references, $props: props } = this;
      const checked = e.target.checked;

      if (props.disabled) {
        return;
      }

      if (vuiCheckboxGroup) {
        const beforeCheck = vuiCheckboxGroup.beforeSelect || vuiCheckboxGroup.beforeCheck;
        const callback = () => vuiCheckboxGroup.handleChange(checked, props.value);
        let hook = true;

        if (is.function(beforeCheck)) {
          hook = beforeCheck(props.value);
        }

        if (is.boolean(hook) && hook === false) {
          references.checkbox.checked = "";
        }
        else if (is.promise(hook)) {
          hook.then(() => callback()).catch(() => references.checkbox.checked = "");
        }
        else {
          callback();
        }
      }
      else if (vuiChoiceGroup) {
        vuiChoiceGroup.handleChange("checkbox", checked, props.value);
      }
      else {
        const value = checked ? props.checkedValue : props.uncheckedValue;

        this.state.checked = value;
        this.$emit("input", value);
        this.$emit('change', value);

        if (props.validator) {
          this.dispatch("vui-form-item", "change", value);
        }
      }
    }
  },
  render() {
    const { vuiForm, vuiCheckboxGroup, vuiChoiceGroup, $slots: slots, $attrs: attrs, $props: props, state } = this;
    const { handleFocus, handleBlur, handleChange } = this;

    // props & state
    let type, name, label, value, size, minWidth, focused, indeterminate, checked, disabled;

    if (vuiCheckboxGroup) {
      type = vuiCheckboxGroup.type;
      name = vuiCheckboxGroup.name;
    }
    else if (vuiChoiceGroup) {
      type = vuiChoiceGroup.type;
      name = vuiChoiceGroup.name;
    }
    else {
      type = props.type;
      name = props.name;
    }

    label = slots.default || props.label;
    value = props.value;

    if (props.size) {
      size = props.size;
    }
    else if (vuiCheckboxGroup && vuiCheckboxGroup.size) {
      size = vuiCheckboxGroup.size;
    }
    else if (vuiChoiceGroup && vuiChoiceGroup.size) {
      size = vuiChoiceGroup.size;
    }
    else if (vuiForm && vuiForm.size) {
      size = vuiForm.size;
    }
    else {
      size = "medium";
    }

    if (props.minWidth) {
      minWidth = props.minWidth;
    }
    else if (vuiCheckboxGroup && vuiCheckboxGroup.minWidth) {
      minWidth = vuiCheckboxGroup.minWidth;
    }
    else if (vuiChoiceGroup && vuiChoiceGroup.minWidth) {
      minWidth = vuiChoiceGroup.minWidth;
    }

    focused = state.focused;
    indeterminate = props.indeterminate;

    if (vuiCheckboxGroup) {
      checked = vuiCheckboxGroup.state.value.indexOf(value) > -1;
    }
    else if (vuiChoiceGroup) {
      checked = is.array(vuiChoiceGroup.state.value) && vuiChoiceGroup.state.value.indexOf(value) > -1;
    }
    else {
      checked = state.checked === props.checkedValue;
    }

    if (vuiForm && vuiForm.disabled) {
      disabled = vuiForm.disabled;
    }
    else if (vuiCheckboxGroup && vuiCheckboxGroup.disabled) {
      disabled = vuiCheckboxGroup.disabled;
    }
    else if (vuiChoiceGroup && vuiChoiceGroup.disabled) {
      disabled = vuiChoiceGroup.disabled;
    }
    else {
      disabled = props.disabled;
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, type === "button" ? "checkbox-button" : "checkbox");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${size}`]: size,
      [`${classNamePrefix}-focused`]: focused,
      [`${classNamePrefix}-indeterminate`]: indeterminate,
      [`${classNamePrefix}-checked`]: checked,
      [`${classNamePrefix}-disabled`]: disabled
    };
    classes.elInput = `${classNamePrefix}-input`;
    classes.elLabel = `${classNamePrefix}-label`;

    // style
    let styles = {};

    if (type === "button" && minWidth) {
      styles.el = {
        minWidth: is.string(minWidth) ? minWidth : `${minWidth}px`
      };
    }

    // render
    const attributes = {
      ref: "checkbox",
      attrs: attrs,
      on: {
        focus: handleFocus,
        blur: handleBlur,
        change: handleChange
      }
    };

    return (
      <label class={classes.el} style={styles.el}>
        <div class={classes.elInput}>
          {
            !type ? (
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
                <path d="M0.020966 0l1023.958044 0 0 1024-1023.958044 0 0-1024Z"></path>
              </svg>
            ) : null
          }
          {
            !type ? (
              <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1248 1024">
                <path d="M123.800257 460.153135l291.677674 232.393077 726.28329-669.078427s48.722384-44.483585 91.293444-9.727389c12.638284 10.392563 27.272086 39.993364-5.653359 86.388252L469.106727 988.380911s-58.120238 79.570536-127.131004-0.831161L14.711914 545.710226s-38.829006-59.865554 9.72861-95.701892c16.463333-11.973111 53.713011-30.763938 99.360954 10.14358z"></path>
              </svg>
            ) : null
          }
          <input type="checkbox" name={name} value={value} checked={checked} disabled={disabled} {...attributes} />
        </div>
        {
          label ? (
            <div class={classes.elLabel}>{label}</div>
          ) : null
        }
      </label>
    );
  }
};