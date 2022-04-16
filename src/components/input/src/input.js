import VuiIcon from "../../icon";
import Emitter from "../../../mixins/emitter";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
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
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    prepend: PropTypes.string,
    append: PropTypes.string,
    prefix: PropTypes.string,
    suffix: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    bordered: PropTypes.bool.def(true),
    autofocus: PropTypes.bool.def(false),
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
      value: is.effective(props.value) ? props.value : ""
    };

    return {
      state
    };
  },
  watch: {
    value(value) {
      const { $props: props, state } = this;

      value = is.effective(value) ? value : "";

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

      const keyCode = e.keyCode;

      if (keyCode === 13) {
        this.$emit("enter", e);
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
      // 这里不能使用 this.$emit("change", e); 抛出 change 事件，因为执行清空时的事件源为图标，而非 input 输入框
      // 使用如下方式手动触发一次 input 输入框的 change 事件
      this.$nextTick(() => {
        const event = document.createEvent("HTMLEvents");

        event.initEvent("change", true, true);
        this.$refs.input.dispatchEvent(event);
      });

      if (props.validator) {
        this.dispatch("vui-form-item", "change", value);
      }
    },
    handleToggle(e) {
      this.state.plaintext = !this.state.plaintext;
    }
  },
  mounted() {
    const { $props: props } = this;

    if (props.autofocus) {
      this.timeout = setTimeout(() => this.focus(), 0);
    }
  },
  beforeDesotry() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = null;
    }
  },
  render(h) {
    const { vuiForm, vuiInputGroup, $slots: slots, $listeners: listeners, $attrs: attrs, $props: props, state  } = this;
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
      [`${classNamePrefix}-with-prefix`]: slots.prefix || props.prefix,
      [`${classNamePrefix}-with-suffix`]: slots.suffix || props.suffix,
      [`${classNamePrefix}-${size}`]: size,
      [`${classNamePrefix}-bordered`]: props.bordered,
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
    let prepend;

    if (slots.prepend || props.prepend) {
      prepend = (
        <div class={classes.elPrepend}>
          {slots.prepend || props.prepend}
        </div>
      )
    }

    let append;

    if (slots.append || props.append) {
      append = (
        <div class={classes.elAppend}>
          {slots.append || props.append}
        </div>
      );
    }

    let prefix;

    if (slots.prefix) {
      prefix = (
        <div class={classes.elPrefix}>
          {slots.prefix}
        </div>
      );
    }
    else if (props.prefix) {
      prefix = (
        <div class={classes.elPrefix}>
          <VuiIcon type={props.prefix} />
        </div>
      );
    }

    let suffix;

    if (props.clearable && !props.readonly && !disabled && state.hovered && is.effective(state.value)) {
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
        <div class={classes.elSuffix}>
          <VuiIcon {...elBtnClearProps} />
        </div>
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
        <div class={classes.elSuffix}>
          <VuiIcon {...elBtnToggleProps} />
        </div>
      );
    }
    else if (slots.suffix) {
      suffix = (
        <div class={classes.elSuffix}>
          {slots.suffix}
        </div>
      );
    }
    else if (props.suffix) {
      suffix = (
        <div class={classes.elSuffix}>
          <VuiIcon type={props.suffix} />
        </div>
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
        {prepend}
        <div class={classes.elInput} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave}>
          {prefix}
          <input {...elInputProps} value={state.value} />
          {suffix}
        </div>
        {append}
      </div>
    );
  }
};

export default VuiInput;