import Emitter from "vui-design/mixins/emitter";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import colours from "vui-design/utils/colours";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiSwitch = {
  name: "vui-switch",
  inject: {
    vuiForm: {
      default: undefined
    }
  },
  mixins: [
    Emitter
  ],
  model: {
    prop: "checked",
    event: "input"
  },
  props: {
    classNamePrefix: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    checked: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(false),
    disabled: PropTypes.bool.def(false),
    loading: PropTypes.bool.def(false),
    checkedValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(true),
    uncheckedValue: PropTypes.oneOfType([PropTypes.bool, PropTypes.string, PropTypes.number]).def(false),
    checkedColor: PropTypes.string,
    uncheckedColor: PropTypes.string,
    checkedText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    uncheckedText: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    beforeChange: PropTypes.func,
    validator: PropTypes.bool.def(true)
  },
  data() {
    const { $props: props } = this;
    const state = {
      focused: false,
      checked: this.checked
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
      const { $props: props } = this;

      if (props.disabled || props.loading) {
        return;
      }

      this.state.focused = true;
      this.$emit("focus");
    },
    handleBlur(e) {
      const { $props: props } = this;

      if (props.disabled || props.loading) {
        return;
      }

      this.state.focused = false;
      this.$emit("blur");
    },
    handleChange(e) {
      const { $props: props, state } = this;

      if (props.disabled || props.loading) {
        return;
      }

      const checked = state.checked === props.checkedValue;
      const oldValue = checked ? props.checkedValue : props.uncheckedValue;
      const newValue = checked ? props.uncheckedValue : props.checkedValue;
      const callback = () => {
        this.state.checked = newValue;
        this.$emit("input", newValue);
        this.$emit('change', newValue);

        if (props.validator) {
          this.dispatch("vui-form-item", "change", newValue);
        }
      };
      let hook = true;

      if (is.function(props.beforeChange)) {
        hook = props.beforeChange(checked, oldValue);
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
    }
  },
  render() {
    const { vuiForm, $slots: slots, $props: props, state } = this;
    const { handleFocus, handleBlur, handleChange } = this;

    // size
    let size;

    if (props.size) {
      size = props.size;
    }
    else if (vuiForm && vuiForm.size) {
      size = vuiForm.size;
    }
    else {
      size = "medium";
    }

    // focused
    const focused = state.focused;

    // checked
    const checked = state.checked === props.checkedValue;

    // disabled
    let disabled;

    if (vuiForm && vuiForm.disabled) {
      disabled = vuiForm.disabled;
    }
    else {
      disabled = props.disabled;
    }

    // loading
    const loading = props.loading;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "switch");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${size}`]: size,
      [`${classNamePrefix}-focused`]: focused,
      [`${classNamePrefix}-checked`]: checked,
      [`${classNamePrefix}-disabled`]: disabled,
      [`${classNamePrefix}-loading`]: loading
    };
    classes.elInput = `${classNamePrefix}-input`;
    classes.elInputSpin = `${classNamePrefix}-input-spin`;
    classes.elLabel = `${classNamePrefix}-label`;

    // style
    let color = checked ? props.checkedColor : props.uncheckedColor;
    let styles = {};

    if (color) {
      if (loading || disabled) {
        color = colours.rgba2hex(colours.hex2rgba(color, 0.6));
      }

      styles.el = {
        backgroundColor: color
      };

      if (loading) {
        styles.elInputSpin = {
          borderBottomColor: color
        };
      }
    }

    // render
    let label;

    if (checked) {
      label = slots.checkedText || props.checkedText;
    }
    else {
      label = slots.uncheckedText || props.uncheckedText;
    }

    return (
      <button
        type="button"
        class={classes.el}
        style={styles.el}
        disabled={disabled || loading}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleChange}
      >
        <div class={classes.elInput}>
          <div class={classes.elInputSpin} style={styles.elInputSpin} />
        </div>
        {
          label !== undefined && (
            <div class={classes.elLabel}>{label}</div>
          )
        }
      </button>
    );
  }
};

export default VuiSwitch;