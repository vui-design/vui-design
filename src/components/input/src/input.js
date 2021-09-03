import VuiIcon from "../../icon";
import Emitter from "../../../mixins/emitter";
import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiInput = {
  name: "vui-input",
  inject: {
    vuiForm: {
      default: undefined
    },
    vuiInputGroup: {
      default: undefined
    }
  },
  components: {
    VuiIcon
  },
  mixins: [
    Emitter
  ],
  inheritAttrs: false,
  props: {
    classNamePrefix: PropTypes.string,
    type: PropTypes.string.def("text"),
    prepend: PropTypes.string,
    append: PropTypes.string,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    clearable: PropTypes.bool.def(false),
    readonly: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    validator: PropTypes.bool.def(true)
  },
  data() {
    const { $props: props } = this;
    const state = {
      hovered: false,
      focused: false,
      plaintext: false,
      value: props.value
    };

    return {
      state
    };
  },
  watch: {
    value(value) {
      const { $props: props, state } = this;

      if (state.value === value) {
        return;
      }

      this.state.value = value;

      if (props.validator) {
        this.dispatch("vui-form-item", "change", value);
      }
    }
  },
  methods: {
    focus() {
      this.$refs.input.focus();
    },
    blur() {
      this.$refs.input.blur();
    },
    handleMouseenter(e) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.state.hovered = true;
      this.$emit("mouseenter", e);
    },
    handleMouseleave(e) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.state.hovered = false;
      this.$emit("mouseleave", e);
    },
    handleFocus(e) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.state.focused = true;
      this.$emit("focus", e);
    },
    handleBlur(e) {
      const { $props: props, state } = this;

      if (props.disabled) {
        return;
      }

      this.state.focused = false;
      this.$emit("blur", e);

      if (props.validator) {
        this.dispatch("vui-form-item", "blur", state.value);
      }
    },
    handleKeydown(e) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.$emit("keydown", e);
    },
    handleKeyup(e) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.$emit("keyup", e);
    },
    handleInput(e) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      const value = e.target.value;

      this.state.value = value;
      this.$emit("input", value);

      if (props.validator) {
        this.dispatch("vui-form-item", "change", value);
      }
    },
    handleChange(e) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.$emit("change", e);
    },
    handleClear(e) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      const value = "";

      this.state.value = value;
      this.focus();
      this.$emit("clear", e);
      this.$emit("input", value);
      this.$emit("change", e);

      if (props.validator) {
        this.dispatch("vui-form-item", "change", value);
      }
    },
    handleToggle(e) {
    this.state.plaintext = !this.state.plaintext;
    }
  },
  render(h) {
    const { $vui: vui, vuiForm, vuiInputGroup, $slots: slots, $listeners: listeners, $attrs: attrs, $props: props, state  } = this;
    const { handleMouseenter, handleMouseleave, handleFocus, handleBlur, handleKeydown, handleKeypress, handleKeyup, handleChange, handleInput, handleClear, handleToggle } = this;

    // type
    let type;

    if (props.type === "password" && state.plaintext) {
      type = "text";
    }
    else {
      type = props.type;
    }

    // size: self > vuiInputGroup > vuiForm > vui
    let size;

    if (props.size) {
      size = props.size;
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

    // disabled: vuiForm > vuiInputGroup > self
    let disabled;

    if (vuiForm && vuiForm.disabled) {
      disabled = vuiForm.disabled;
    }
    else if (vuiInputGroup && vuiInputGroup.disabled) {
      disabled = vuiInputGroup.disabled;
    }
    else {
      disabled = props.disabled;
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "input");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${size}`]: size,
      [`${classNamePrefix}-hovered`]: state.hovered,
      [`${classNamePrefix}-focused`]: state.focused,
      [`${classNamePrefix}-disabled`]: disabled
    };
    classes.elPrepend = `${classNamePrefix}-prepend`;
    classes.elAppend = `${classNamePrefix}-append`;
    classes.elPrefix = `${classNamePrefix}-prefix`;
    classes.elSuffix = `${classNamePrefix}-suffix`;
    classes.elInput = `${classNamePrefix}-input`;
    classes.elBtnToggle = `${classNamePrefix}-btn-toggle`;
    classes.elBtnClear = `${classNamePrefix}-btn-clear`;

    // render
    const prepend = slots.prepend || props.prepend;
    const append = slots.append || props.append;
    let prefix;
    let suffix;

    if (slots.prefix) {
      prefix = slots.prefix;
    }
    else if (props.prefix) {
      prefix = (
        <VuiIcon type={props.prefix} />
      );
    }

    if (props.clearable && !props.readonly && !disabled && state.hovered && state.value !== "") {
      const elBtnClearProps = {
        props: {
          type: "crossmark-circle-filled"
        },
        class: classes.elBtnClear,
        on: {
          mousedown: e => e.preventDefault(),
          click: handleClear
        }
      };

      suffix = (
        <VuiIcon {...elBtnClearProps} />
      );
    }
    else if (props.type === "password" && !props.readonly && !disabled) {
      const elBtnToggleProps = {
        props: {
          type: state.plaintext ? "eye-off" : "eye"
        },
        class: classes.elBtnToggle,
        on: {
          mousedown: e => e.preventDefault(),
          click: handleToggle
        }
      };

      suffix = (
        <VuiIcon {...elBtnToggleProps} />
      );
    }
    else if (slots.suffix) {
      suffix = slots.suffix;
    }
    else if (props.suffix) {
      suffix = (
        <VuiIcon type={props.suffix} />
      );
    }

    const elInputProps = {
      ref: "input",
      attrs: {
        ...attrs,
        autocomplete: "off",
        spellcheck: false,
        type: type,
        placeholder: props.placeholder,
        maxLength: props.maxLength,
        readonly: props.readonly,
        disabled: disabled
      },
      on: {
        ...listeners,
        focus: handleFocus,
        blur: handleBlur,
        keydown: handleKeydown,
        keyup: handleKeyup,
        change: handleChange,
        input: handleInput
      }
    };

    return (
      <div class={classes.el}>
        {
          prepend && (
            <div class={classes.elPrepend}>{prepend}</div>
          )
        }
        <div class={classes.elInput} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave}>
        {
          prefix && (
            <div class={classes.elPrefix}>{prefix}</div>
          )
        }
        <input {...elInputProps} value={state.value} />
        {
          suffix && (
            <div class={classes.elSuffix}>{suffix}</div>
          )
        }
        </div>
          {
          append && (
            <div class={classes.elAppend}>{append}</div>
          )
        }
      </div>
    );
  }
};

export default VuiInput;