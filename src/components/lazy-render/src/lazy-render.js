import PropTypes from "../../../utils/prop-types";

const VuiLazyRender = {
  name: "vui-lazy-render",
  props: {
    render: PropTypes.bool.def(false)
  },
  data() {
    const state = {
      rendered: this.render
    };

    return {
      state
    };
  },
  watch: {
    render(value) {
      if (!value || this.state.rendered) {
        return;
      }

      this.state.rendered = true;
    }
  },
  render() {
    if (!this.state.rendered) {
      return null;
    }

    return this.$slots.default;
  }
};

export default VuiLazyRender;