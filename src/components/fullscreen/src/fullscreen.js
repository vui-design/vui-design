import PropTypes from "../../../utils/prop-types";
import fullscreen from "../../../utils/fullscreen";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

export default {
  name: "vui-fullscreen",
  props: {
    classNamePrefix: PropTypes.string,
    value: PropTypes.bool.def(false)
  },
  data() {
    const state = {
      status: false
    };

    return {
      state
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(value) {
        const status = fullscreen.getStatus();
        const { request, exit } = this;

        if (value !== status) {
          value ? request() : exit();
        }

        this.state.status = value;
      }
    }
  },
  methods: {
    callback() {
      this.state.status = fullscreen.getStatus();

      if (!this.state.status) {
        fullscreen.removeEventListener(this.callback);
      }

      this.$emit("input", this.state.status);
      this.$emit("change", this.state.status);
    },
    request() {
      if (!fullscreen.isSupport() || fullscreen.getStatus()) {
        return;
      }

      const { $el: element, callback } = this;

      fullscreen.addEventListener(callback);
      fullscreen.request(element);
    },
    exit() {
      if (!fullscreen.isSupport() || !fullscreen.getStatus()) {
        return;
      }

      fullscreen.exit();
    },
    handleClick(e) {
      const { $el: element, exit } = this;

      if (e.target === element) {
        exit();
      }
    }
  },
  render() {
    const { $slots: slots, $props: props, state } = this;
    const { handleClick } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "fullscreen");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-on`]: state.status
    };

    // style
    let styles = {};

    if (state.status) {
      styles.el = {
        width: "100%",
        height: "100%",
        overflowY: "auto"
      };
    }

    // render
    return (
      <div class={classes.el} style={styles.el} onClick={handleClick}>
        {slots.default}
      </div>
    );
  }
};