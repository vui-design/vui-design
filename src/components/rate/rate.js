import VuiRateStar from "./rate-star";
import Emitter from "../../mixins/emitter";
import PropTypes from "../../utils/prop-types";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    value: PropTypes.number.def(0),
    count: PropTypes.number.def(5),
    character: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    tooltips: PropTypes.array.def([]),
    allowHalf: PropTypes.bool.def(false),
    clearable: PropTypes.bool.def(true),
    disabled: PropTypes.bool.def(false),
    validator: PropTypes.bool.def(true)
  };
};

export default {
  name: "vui-rate",
  provide() {
    return {
      vuiRate: this
    };
  },
  components: {
    VuiRateStar
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
      value: props.value,
      cleaned: undefined,
      mouseentered: undefined
    };

    return {
      state
    };
  },
  watch: {
    value(value) {
      this.state.value = value;
    }
  },
  methods: {
    getStarValue(value, half) {
      const { $props: props } = this;

      if (props.allowHalf && half) {
        return value - 0.5;
      }

      return value;
    },
    handleMouseenter(e, value, half) {
      const { state } = this;

      value = this.getStarValue(value, half);

      if (value === state.cleaned) {
        return;
      }

      this.state.cleaned = undefined;
      this.state.mouseentered = value;
    },
    handleMouseleave() {
      this.state.cleaned = undefined;
      this.state.mouseentered = undefined;
    },
    handleClick(e, value, half) {
      const { $props: props, state } = this;
      let maybeClean = false;

      value = this.getStarValue(value, half);

      if (props.clearable) {
        maybeClean = value === state.value;
      }

      this.state.value = maybeClean ? 0 : value;
      this.state.cleaned = maybeClean ? value : undefined;
      this.state.mouseentered = undefined;
      this.$emit("input", this.state.value);
      this.$emit("change", this.state.value);

      if (props.validator) {
        this.dispatch("vui-form-item", "change", this.state.value);
      }
    }
  },
  render() {
    const { $slots: slots, $props: props } = this;
    const { handleMouseleave } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "rate");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-disabled`]: props.disabled
    };

    // render
    let stars = [];

    for (let index = 0; index < props.count; index++) {
      const attributes = {
        ref: "star" + index,
        key: index,
        props: {
          classNamePrefix: classNamePrefix,
          index: index,
          value: index + 1,
          character: props.character,
          tooltip: props.tooltips[index],
          disabled: props.disabled
        },
        on: {
          mouseenter: this.handleMouseenter,
          click: this.handleClick
        }
      };

      stars.push(
        <li>
          <VuiRateStar {...attributes}>{slots.character}</VuiRateStar>
        </li>
      );
    }

    return (
      <ul class={classes.el} onMouseleave={handleMouseleave}>{stars}</ul>
    );
  }
};