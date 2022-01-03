import VuiIcon from "../../icon";
import Emitter from "../../../mixins/emitter";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import merge from "../../../utils/merge";
import setStyle from "../../../utils/setStyle";
import getTextareaSize from "../../../utils/getTextareaSize";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiTextarea = {
  name: "vui-textarea",
  inject: {
    vuiForm: {
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
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    maxLength: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rows: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(4),
    autosize: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).def(false),
    resizable: PropTypes.bool.def(false),
    bordered: PropTypes.bool.def(true),
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
      this.resize();

      if (props.validator) {
        this.dispatch("vui-form-item", "change", value);
      }
    },
    rows() {
      this.resize();
    },
    autosize() {
      this.resize();
    }
  },
  methods: {
    focus() {
      this.$refs.textarea.focus();
    },
    blur() {
      this.$refs.textarea.blur();
    },
    resize() {
      if (is.server) {
        return;
      }

      const nextTick = () => {
        const { $refs: references, $props: props } = this;
        let styles = null;

        if (!props.autosize) {
          const minHeight = getTextareaSize(references.textarea, props.rows).minHeight;

          styles = {
            height: minHeight,
            minHeight: minHeight
          };
        }
        else {
          let { minRows, maxRows } = props.autosize;

          if (!minRows) {
            minRows = props.rows;
          }

          styles = getTextareaSize(references.textarea, minRows, maxRows);
        }

        setStyle(references.textarea, merge(styles, {
          resize: props.resizable ? "vertical" : "none"
        }));
      }

      this.$nextTick(nextTick);
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
      this.resize();
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
      this.resize();
      this.focus();
      this.$emit("clear", e);
      this.$emit("input", value);
      this.$emit("change", e);

      if (props.validator) {
        this.dispatch("vui-form-item", "change", value);
      }
    }
  },
  mounted() {
    this.resize();
  },
  render(h) {
    const { vuiForm, $listeners: listeners, $attrs: attrs, $props: props, state } = this;
    const { handleMouseenter, handleMouseleave, handleFocus, handleBlur, handleKeydown, handleKeyup, handleChange, handleInput, handleClear } = this;

    // disabled: vuiForm > self
    let disabled;

    if (vuiForm && vuiForm.disabled) {
      disabled = vuiForm.disabled;
    }
    else {
      disabled = props.disabled;
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "textarea");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-bordered`]: props.bordered,
      [`${classNamePrefix}-hovered`]: state.hovered,
      [`${classNamePrefix}-focused`]: state.focused,
      [`${classNamePrefix}-disabled`]: disabled
    };
    classes.elInput = `${classNamePrefix}-input`;
    classes.elBtnClear = `${classNamePrefix}-btn-clear`;
    classes.elStatistic = `${classNamePrefix}-statistic`;

    // input
    const elInputProps = {
      ref: "textarea",
      attrs: {
        ...attrs,
        placeholder: props.placeholder,
        maxLength: props.maxLength,
        rows: props.autosize && props.autosize.minRows ? props.autosize.minRows : props.rows,
        readonly: props.readonly,
        disabled: disabled,
        class: classes.elInput
      },
      on: {
        ...listeners,
        focus: handleFocus,
        blur: handleBlur,
        keydown: handleKeydown,
        keyup: handleKeyup,
        input: handleInput,
        change: handleChange
      }
    };

    const input = (
      <textarea {...elInputProps} value={state.value} />
    );

    // btnClear
    let btnClear;

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

      btnClear = (
        <VuiIcon {...elBtnClearProps} />
      );
    }

    // statistic
    let statistic;

    if (props.maxLength) {
      const length = String(state.value).length;

      statistic = (
        <label class={classes.elStatistic}>{length}/{props.maxLength}</label>
      );
    }

    // render
    return (
      <div class={classes.el} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave}>
        {input}
        {btnClear}
        {statistic}
      </div>
    );
  }
};

export default VuiTextarea;