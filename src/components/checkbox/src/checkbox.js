import Emitter from "vui-design/mixins/emitter";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiCheckbox = {
  name: "vui-checkbox",
  inject: {
    vuiForm: {
      default: undefined
    },
    vuiCheckboxGroup: {
      default: undefined
    },
    vuiMutexGroup: {
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
  props: {
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
  },
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
      const { $props: props, state } = this;

      if (state.checked === value) {
        return;
      }

      this.state.checked = value;

      if (props.validator) {
        this.dispatch("vui-form-item", "change", value);
      }
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
      const { vuiCheckboxGroup, vuiMutexGroup, $props: props } = this;
      const checked = e.target.checked;

      if (props.disabled) {
        return;
      }

      if (vuiCheckboxGroup) {
        vuiCheckboxGroup.handleChange(checked, props.value);
      }
      else if (vuiMutexGroup) {
        vuiMutexGroup.handleChange("checkbox", checked, props.value);
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
    const { vuiForm, vuiCheckboxGroup, vuiMutexGroup, $slots: slots, $attrs: attrs, $props: props, state } = this;
    const { handleFocus, handleBlur, handleChange } = this;

    // props & state
    let type, name, label, value, size, minWidth, focused, indeterminate, checked, disabled;

    if (vuiCheckboxGroup) {
      type = vuiCheckboxGroup.type;
      name = vuiCheckboxGroup.name;
    }
    else if (vuiMutexGroup) {
      type = vuiMutexGroup.type;
      name = vuiMutexGroup.name;
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
    else if (vuiMutexGroup && vuiMutexGroup.size) {
      size = vuiMutexGroup.size;
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
    else if (vuiMutexGroup && vuiMutexGroup.minWidth) {
      minWidth = vuiMutexGroup.minWidth;
    }

    focused = state.focused;
    indeterminate = props.indeterminate;

    if (vuiCheckboxGroup) {
      checked = vuiCheckboxGroup.state.value.indexOf(value) > -1;
    }
    else if (vuiMutexGroup) {
      checked = is.array(vuiMutexGroup.state.value) && vuiMutexGroup.state.value.indexOf(value) > -1;
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
    else if (vuiMutexGroup && vuiMutexGroup.disabled) {
      disabled = vuiMutexGroup.disabled;
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
    const checkboxInputProps = {
      attrs: attrs,
      on: {
        focus: handleFocus,
        blur: handleBlur,
        change: handleChange
      }
    };
    const checkboxInput = [];

    if (!type) {
      checkboxInput.push(
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024">
          <path d="M0.020966 0l1023.958044 0 0 1024-1023.958044 0 0-1024Z"></path>
        </svg>
      );

      checkboxInput.push(
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1248 1024">
          <path d="M123.800257 460.153135l291.677674 232.393077 726.28329-669.078427s48.722384-44.483585 91.293444-9.727389c12.638284 10.392563 27.272086 39.993364-5.653359 86.388252L469.106727 988.380911s-58.120238 79.570536-127.131004-0.831161L14.711914 545.710226s-38.829006-59.865554 9.72861-95.701892c16.463333-11.973111 53.713011-30.763938 99.360954 10.14358z"></path>
        </svg>
      );
    }

    checkboxInput.push(
      <input type="checkbox" name={name} value={value} checked={checked} disabled={disabled} {...checkboxInputProps} />
    );

    return (
      <label class={classes.el} style={styles.el}>
        <div class={classes.elInput}>{checkboxInput}</div>
        {
          label && (
            <div class={classes.elLabel}>{label}</div>
          )
        }
      </label>
    );
  }
};

export default VuiCheckbox;