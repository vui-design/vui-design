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
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(false),
    disabled: PropTypes.bool.def(false),
    checkedValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(true),
    uncheckedValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(false),
    validator: PropTypes.bool.def(true)
  };
};

export default {
  name: "vui-radio",
  inject: {
    vuiForm: {
      default: undefined
    },
    vuiRadioGroup: {
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
      const { vuiRadioGroup, vuiChoiceGroup, $refs: references, $props: props } = this;
      const checked = e.target.checked;

      if (props.disabled) {
        return;
      }

      if (vuiRadioGroup) {
        const beforeCheck = vuiRadioGroup.beforeSelect || vuiRadioGroup.beforeCheck;
        const callback = () => vuiRadioGroup.handleChange(checked, props.value);
        let hook = true;

        if (is.function(beforeCheck)) {
          hook = beforeCheck(props.value);
        }

        if (is.boolean(hook) && hook === false) {
          references.radio.checked = "";
        }
        else if (is.promise(hook)) {
          hook.then(() => callback()).catch(() => references.radio.checked = "");
        }
        else {
          callback();
        }
      }
      else if (vuiChoiceGroup) {
        vuiChoiceGroup.handleChange("radio", checked, props.value);
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
    const { vuiForm, vuiRadioGroup, vuiChoiceGroup, $slots: slots, $attrs: attrs, $props: props, state } = this;
    const { handleFocus, handleBlur, handleChange } = this;
  
    // props & state
    let type, name, label, value, size, minWidth, focused, checked, disabled;

    if (vuiRadioGroup) {
      type = vuiRadioGroup.type;
      name = vuiRadioGroup.name;
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
    else if (vuiRadioGroup && vuiRadioGroup.size) {
      size = vuiRadioGroup.size;
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
    else if (vuiRadioGroup && vuiRadioGroup.minWidth) {
      minWidth = vuiRadioGroup.minWidth;
    }
    else if (vuiChoiceGroup && vuiChoiceGroup.minWidth) {
      minWidth = vuiChoiceGroup.minWidth;
    }

    focused = state.focused;

    if (vuiRadioGroup) {
      checked = value === vuiRadioGroup.state.value;
    }
    else if (vuiChoiceGroup) {
      checked = !is.array(vuiChoiceGroup.state.value) && value === vuiChoiceGroup.state.value;
    }
    else {
      checked = state.checked === props.checkedValue;
    }

    if (vuiForm && vuiForm.disabled) {
      disabled = vuiForm.disabled;
    }
    else if (vuiRadioGroup && vuiRadioGroup.disabled) {
      disabled = vuiRadioGroup.disabled;
    }
    else if (vuiChoiceGroup && vuiChoiceGroup.disabled) {
      disabled = vuiChoiceGroup.disabled;
    }
    else {
      disabled = props.disabled;
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, type === "button" ? "radio-button" : "radio");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${size}`]: size,
      [`${classNamePrefix}-focused`]: focused,
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
      ref: "radio",
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
          <input type="radio" name={name} value={value} checked={checked} disabled={disabled} {...attributes} />
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