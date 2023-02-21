import PropTypes from "../../utils/prop-types";
import is from "../../utils/is";
import debounce from "../../utils/debounce";
import getClassNamePrefix from "../../utils/getClassNamePrefix";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    fullscreen: PropTypes.bool.def(false),
    size: PropTypes.oneOf(["small", "medium", "large"]).def("medium"),
    spinning: PropTypes.bool.def(true),
    delay: PropTypes.number,
    indicator: PropTypes.func,
    message: PropTypes.string
  };
};

export default {
  name: "vui-spin",
  props: createProps(),
  data() {
    const { $props: props } = this;
    const shouldBeDelayed = props.spinning && is.number(props.delay) && props.delay > 0;

    return {
      state: {
        spinning: props.spinning && !shouldBeDelayed
      }
    };
  },
  created() {
    this.addSpinningDebouncer();
  },
  mounted() {
    this.changeSpinning();
  },
  updated() {
    const nextTick = () => {
      this.addSpinningDebouncer();
      this.changeSpinning();
    };

    this.$nextTick(nextTick);
  },
  beforeDestroy() {
    this.removeSpinningDebouncer();
  },
  methods: {
    changeSpinning() {
      const { $props: props, state } = this;

      if (props.spinning === state.spinning) {
        return;
      }

      this.state.spinning = props.spinning;
    },
    addSpinningDebouncer() {
      const { $props: props } = this;

      if (is.number(props.delay) && props.delay > 0) {
        this.removeSpinningDebouncer();
        this.changeSpinning = debounce(this.changeSpinning, props.delay);
      }
    },
    removeSpinningDebouncer() {
      if (this.changeSpinning && this.changeSpinning.cancel) {
        this.changeSpinning = this.changeSpinning.cancel();
      }
    }
  },
  render(h) {
    const { $slots: slots, $props: props, state } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "spin");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-fullscreen`]: props.fullscreen,
      [`${classNamePrefix}-with-children`]: slots.default,
      [`${classNamePrefix}-${props.size}`]: props.size,
      [`${classNamePrefix}-spinning`]: state.spinning
    };
    classes.elSpinner = `${classNamePrefix}-spinner`;
    classes.elIndicator = `${classNamePrefix}-indicator`;
    classes.elDot = `${classNamePrefix}-dot`;
    classes.elDotItem = `${classNamePrefix}-dot-item`;
    classes.elMessage = `${classNamePrefix}-message`;
    classes.elChildren = `${classNamePrefix}-children`;

    // indicator
    let indicator;

    if (slots.indicator) {
      indicator = slots.indicator;
    }
    else if (is.function(props.indicator)) {
      indicator = props.indicator(h);
    }
    else {
      indicator = (
        <div class={classes.elDot}>
          <div class={classes.elDotItem}></div>
          <div class={classes.elDotItem}></div>
          <div class={classes.elDotItem}></div>
        </div>
      );
    }

    // message
    let message = slots.message || props.message;

    // render
    let spinner = [];

    spinner.push(
      <div class={classes.elIndicator}>{indicator}</div>
    );

    if (message) {
      spinner.push(
        <div class={classes.elMessage}>{message}</div>
      );
    }

    return (
      <div class={classes.el}>
        {
          slots.default && (
            <div class={classes.elChildren}>{slots.default}</div>
          )
        }
        {
          state.spinning && (
            <div class={classes.elSpinner}>{spinner}</div>
          )
        }
      </div>
    );
  }
};