import VuiRadio from "../radio";
import VuiCheckbox from "../checkbox";
import Emitter from "../../mixins/emitter";
import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import guid from "../../utils/guid";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    name: PropTypes.string.def(() => guid()),
    layout: PropTypes.oneOf(["horizontal", "vertical"]).def("horizontal"),
    type: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.array]),
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool, PropTypes.array]),
    options: PropTypes.array.def([]),
    disabled: PropTypes.bool.def(false),
    validator: PropTypes.bool.def(true)
  };
};

export default {
  name: "vui-choice-group",
  inject: {
    vuiForm: {
      default: undefined
    }
  },
  provide() {
    return {
      vuiChoiceGroup: this
    };
  },
  components: {
    VuiRadio,
    VuiCheckbox
  },
  mixins: [
    Emitter
  ],
  model: {
    prop: "value",
    event: "input"
  },
  props: createProps(),
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
      if (this.state.value === value) {
        return;
      }

      this.state.value = value;
    }
  },
  methods: {
    handleChange(type, checked, value) {
      const { $props: props, state } = this;
      let nextValue = is.array(state.value) ? [...state.value] : state.value;

      if (type === "radio") {
        nextValue = checked ? value : props.defaultValue;
      }
      else if (type === "checkbox") {
        if (checked) {
          if (is.array(nextValue)) {
            nextValue.push(value);
          }
          else {
            nextValue = [value];
          }
        }
        else {
          if (is.array(nextValue)) {
            nextValue.splice(nextValue.indexOf(value), 1);
          }
          else {
            nextValue = [];
          }
        }

        if (nextValue.length === 0) {
          nextValue = props.defaultValue;
        }
      }

      this.state.value = nextValue;
      this.$emit("input", nextValue);
      this.$emit('change', nextValue);

      if (props.validator) {
        this.dispatch("vui-form-item", "change", nextValue);
      }
    }
  },
  render() {
    const { $slots: slots, $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "choice-group");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${props.layout}`]: true
    };

    // render
    let children;

    if (props.options && props.options.length > 0) {
      children = props.options.map(option => {
        if (!is.object(option)) {
          return;
        }

        if (option.type === "radio") {
          return (
            <VuiRadio key={option.value} value={option.value} disabled={option.disabled}>{option.label}</VuiRadio>
          );
        }
        else if (option.type === "checkbox") {
          return (
            <VuiCheckbox key={option.value} value={option.value} disabled={option.disabled}>{option.label}</VuiCheckbox>
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