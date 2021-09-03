import VuiRadio from "../../radio";
import Emitter from "../../../mixins/emitter";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import guid from "../../../utils/guid";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiRadioGroup = {
  name: "vui-radio-group",
  inject: {
    vuiForm: {
      default: undefined
    }
  },
  provide() {
    return {
      vuiRadioGroup: this
    };
  },
  components: {
    VuiRadio
  },
  mixins: [
    Emitter
  ],
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    classNamePrefix: PropTypes.string,
    name: PropTypes.string.def(() => guid()),
    layout: PropTypes.oneOf(["horizontal", "vertical"]).def("horizontal"),
    type: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
    options: PropTypes.array.def(() => []),
    disabled: PropTypes.bool.def(false),
    validator: PropTypes.bool.def(true)
  },
  data() {
    const { $props: props } = this;
    const state = {
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
    handleChange(checked, value) {
      const { $props: props } = this;
      const nextValue = checked ? value : undefined;

      this.state.value = nextValue;
      this.$emit("input", nextValue);
      this.$emit('change', nextValue);

      if (props.validator) {
        this.dispatch("vui-form-item", "change", nextValue);
      }
    }
  },
  render() {
    const { $slots: slots, $props: props, state } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "radio-group");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.layout}`]: true
    };

    // render
    let children;

    if (props.options && props.options.length > 0) {
      children = props.options.map((option, index) => {
        if (is.object(option)) {
          return (
            <VuiRadio key={is.boolean(option.value) ? index : option.value} value={option.value} disabled={option.disabled}>{option.label}</VuiRadio>
          );
        }
        else {
          return (
            <VuiRadio key={is.boolean(option) ? index : option} value={option}>{option}</VuiRadio>
          );
        }
      });
    }
    else {
      children = slots.default;
    }

    return (
      <div class={classes.el}>{children}</div>
    );
  }
};

export default VuiRadioGroup;