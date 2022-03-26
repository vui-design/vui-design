import VuiIcon from "../../icon";
import Emitter from "../../../mixins/emitter";
import Longpress from "../../../directives/longpress";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getNumberPrecision from "../../../utils/getNumberPrecision";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const numeric = /^[\+\-]?\d*?\.?\d*?$/;

const VuiInputNumber = {
  name: "vui-input-number",
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
  directives: {
    Longpress
  },
  inheritAttrs: false,
  props: {
    classNamePrefix: PropTypes.string,
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    min: PropTypes.number.def(-Infinity),
    max: PropTypes.number.def(Infinity),
    step: PropTypes.number.def(1),
    precision: PropTypes.number,
    formatter: PropTypes.func,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    autofocus: PropTypes.bool.def(false),
    readonly: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    validator: PropTypes.bool.def(true)
  },
  data() {
    const state = {
      hovered: false,
      focused: false,
      inputting: false,
      value: undefined,
      text: ""
    };

    return {
      state
    };
  },
  computed: {
    nextProps() {
      return {
        value: this.value,
        min: this.min,
        max: this.max,
        step: this.step,
        precision: this.precision
      };
    }
  },
  watch: {
    nextProps: {
      immediate: true,
      deep: true,
      handler(value) {
        this.state.value = this.getValueFromProps(value);
        this.state.text = this.state.inputting ? this.state.text : this.getTextByValue(this.state.value, value);
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
    isCompleteNumber(text) {
      const string = text.trim();
      let bool = false;

      if (string.length === 0 || (string.length > 0 && numeric.test(string))) {
        bool = true;
      }

      return bool;
    },
    isValidNumber(text) {
      const string = text.trim();
      let bool = false;

      if (string.length > 0 && numeric.test(string)) {
        bool = true;
      }

      return bool;
    },
    getPrecision(value, step, precision) {
      const a = getNumberPrecision(value);
      const b = getNumberPrecision(step);

      if (!is.number(precision)) {
        return Math.max(a, b);
      }

      if (b > precision) {
        console.warn("[Vui warn][InputNumber]: the \"precision\" should not be less than the decimal places of \"step\"!");
      }

      return precision;
    },
    setPrecision(value, precision) {
      return parseFloat(Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision));
    },
    getValueFromProps(props) {
      let value;

      if (is.number(props.value)) {
        value = props.value;
      }
      else if (is.string(props.value)) {
        value = props.value.trim();
        value = value.length > 0 ? Number(value) : undefined;
      }

      if (!is.number(value)) {
        return;
      }

      const precision = this.getPrecision(value, props.step, props.precision);

      if (is.number(precision)) {
        value = this.setPrecision(value, precision);
      }

      if (is.number(props.min) && value < props.min) {
        value = props.min;
      }

      if (is.number(props.max) && value > props.max) {
        value = props.max;
      }

      return value;
    },
    getTextByValue(value, props) {
      let text = "";

      if (!is.existy(value)) {
        return text;
      }

      const precision = this.getPrecision(value, props.step, props.precision);

      if (is.number(precision)) {
        text = value.toFixed(precision);
      }
      else {
        text = value.toString();
      }

      return text;
    },
    increase(value, step, precision) {
      if (!is.existy(value)) {
        return 0;
      }

      if (!is.number(value)) {
        return this.state.value;
      }

      precision = this.getPrecision(value, step, precision);

      const factor = Math.pow(10, precision);

      return this.setPrecision((factor * value + factor * step) / factor, precision);
    },
    decrease(value, step, precision) {
      if (!is.existy(value)) {
        return 0;
      }

      if (!is.number(value)) {
        return this.state.value;
      }

      precision = this.getPrecision(value, step, precision);

      const factor = Math.pow(10, this.getPrecision());

      return this.setPrecision((factor * value - factor * step) / factor, precision);
    },
    change(value) {
      if (this.state.value === value) {
        return;
      }

      this.state.value = value;
      this.$emit("input", value);
      this.$emit("change", value);

      if (this.validator) {
        this.dispatch("vui-form-item", "change", value);
      }
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
      const keyCode = e.keyCode;

      if (keyCode === 38) {
        e.preventDefault();
        this.handleIncrease();
      }
      else if (keyCode === 40) {
        e.preventDefault();
        this.handleDecrease();
      }

      this.$emit("keydown", e);
    },
    handleKeyup(e) {
      this.$emit("keyup", e);
    },
    handleInput(e) {
      const { $props: props } = this;
      let text = e.target.value;

      this.state.inputting = true;
      this.state.text = text;

      if (this.isCompleteNumber(text)) {
        const string = text.trim();

        if (string.length === 0) {
          this.change(undefined);
        }
        else {
          let value = Number(string);

          if (!is.number(value)) {
            return;
          }

          const precision = this.getPrecision(value, props.step, props.precision);

          if (is.number(precision)) {
            value = this.setPrecision(value, precision);
          }

          if (is.number(props.min) && value < props.min) {
            return;
          }

          if (is.number(props.max) && value > props.max) {
            return;
          }

          this.change(value);
        }
      }
    },
    handleChange(e) {
      const { $props: props } = this;
      let text = e.target.value;

      this.state.inputting = false;

      if (this.isValidNumber(text)) {
        const string = text.trim();
        let value = Number(text);

        if (!is.number(value)) {
          return;
        }

        const precision = this.getPrecision(value, props.step, props.precision);

        if (is.number(precision)) {
          value = this.setPrecision(value, precision);
        }

        if (is.number(props.min) && value < props.min) {
          value = props.min;
        }

        if (is.number(props.max) && value > props.max) {
          value = props.max;
        }

        if (value === this.state.value) {
          this.state.text = this.getTextByValue(this.state.value, props);
        }
        else {
          this.change(value);
        }
      }
      else {
        this.state.text = this.getTextByValue(this.state.value, props);
      }
    },
    handleIncrease() {
      const { $props: props, state } = this;
      const value = this.increase(state.value, props.step, props.precision);
      const btnIncreaseDisabled = value > props.max;

      if (!state.focused) {
        this.focus();
      }

      if (btnIncreaseDisabled) {
        return;
      }

      this.change(value);
    },
    handleDecrease() {
      const { state, $props: props } = this;
      const value = this.decrease(state.value, props.step, props.precision);
      const btnDecreaseDisabled = value < props.min;

      if (!state.focused) {
        this.focus();
      }

      if (btnDecreaseDisabled) {
        return;
      }

      this.change(value);
    },
    handleIncreaseMousedown(e) {
      e.preventDefault();
    },
    handleDecreaseMousedown(e) {
      e.preventDefault();
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
    const { vuiForm, vuiInputGroup, $listeners: listeners, $attrs: attrs, $props: props, state } = this;
    const { handleMouseenter, handleMouseleave, handleFocus, handleBlur, handleKeydown, handleKeyup, handleInput, handleChange, handleIncrease, handleDecrease, handleIncreaseMousedown, handleDecreaseMousedown } = this;

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

    // the disabled of increase button
    const btnIncreaseDisabled = this.increase(state.value, props.step, props.precision) > props.max;

    // the disabled of decrease button
    const btnDecreaseDisabled = this.decrease(state.value, props.step, props.precision) < props.min;

    // value
    let value = "";

    if (state.focused) {
      value = state.text;
    }
    else {
      value = state.value;

      if (is.number(value)) {
        const precision = this.getPrecision(value, props.step, props.precision);

        if (is.number(precision)) {
          value = value.toFixed(precision);
        }
        else {
          value = value.toString();
        }
      }
    }

    if (state.focused === false && is.existy(value) && is.function(props.formatter)) {
      value = props.formatter(value);
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "input-number");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${size}`]: size,
      [`${classNamePrefix}-hovered`]: state.hovered,
      [`${classNamePrefix}-focused`]: state.focused,
      [`${classNamePrefix}-disabled`]: disabled
    };
    classes.elInput = `${classNamePrefix}-input`;
    classes.elTrigger = `${classNamePrefix}-trigger`;
    classes.elBtnIncrease = {
      [`${classNamePrefix}-btn`]: true,
      [`${classNamePrefix}-btn-increase`]: true,
      [`${classNamePrefix}-btn-disabled`]: btnIncreaseDisabled
    };
    classes.elBtnDecrease = {
      [`${classNamePrefix}-btn`]: true,
      [`${classNamePrefix}-btn-decrease`]: true,
      [`${classNamePrefix}-btn-disabled`]: btnDecreaseDisabled
    };

    // render
    const elInputProps = {
      ref: "input",
      attrs: {
        ...attrs,
        type: "text",
        autocomplete: "off",
        spellcheck: false,
        placeholder: props.placeholder,
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

    return (
      <div class={classes.el} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave}>
        <input {...elInputProps} value={value} />
        {
          !props.readonly && !disabled && (
            <div class={classes.elTrigger}>
              <div class={classes.elBtnIncrease} v-longpress={handleIncrease} onMousedown={handleIncreaseMousedown}>
                <VuiIcon type="chevron-up" />
              </div>
              <div class={classes.elBtnDecrease} v-longpress={handleDecrease} onMousedown={handleDecreaseMousedown}>
                <VuiIcon type="chevron-down" />
              </div>
            </div>
          )
        }
      </div>
    );
  }
};

export default VuiInputNumber;