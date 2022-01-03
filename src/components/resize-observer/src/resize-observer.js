import ResizeObserver from "resize-observer-polyfill";
import PropTypes from "../../../utils/prop-types";

const VuiResizeObserver = {
  name: "vui-resize-observer",
  props: {
    disabled: PropTypes.bool
  },
  data() {
    return {
      width: 0,
      height: 0
    };
  },
  methods: {
    addObserver() {
      const { $el: element, $props: props } = this;

      if (props.disabled) {
        return this.removeObserver();
      }

      const isChanged = element !== this.element;

      if (isChanged) {
        this.removeObserver();
        this.element = element;
      }

      if (element && !this.observer) {
        this.observer = new ResizeObserver(this.handleResize);
        this.observer.observe(element);
      }
    },
    removeObserver() {
      if (this.element) {
        this.element = null;
      }

      if (this.observer) {
        this.observer.disconnect();
        this.observer = null;
      }
    },
    handleResize(entries) {
      const { target } = entries[0];
      let { width, height } = target.getBoundingClientRect();

      width = Math.floor(width);
      height = Math.floor(height);

      if (this.width !== width || this.height !== height) {
        this.width = width;
        this.height = height;
        this.$emit("resize", { width, height });
      }
    }
  },
  created() {
    this.element = null;
    this.observer = null;
  },
  mounted() {
    this.addObserver();
  },
  updated() {
    this.addObserver();
  },
  beforeDestroy() {
    this.removeObserver();
  },
  render() {
    const { $slots: slots } = this;

    return slots.default ? slots.default[0] : null;
  }
};

export default VuiResizeObserver;