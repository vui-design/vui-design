import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import QRCode from "arale-qrcode";

const VuiQrcode = {
  name: "vui-qrcode",
  props: {
    classNamePrefix: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tag: PropTypes.oneOf(["canvas", "svg", "table"]).def("canvas"),
    size: PropTypes.number.def(148),
    correctLevel: PropTypes.oneOf([0, 1, 2, 3]).def(3),
    background: PropTypes.string.def("#ffffff"),
    foreground: PropTypes.string.def("#000000"),
    pdground: PropTypes.string.def("#000000"),
    image: PropTypes.string,
    imageSize: PropTypes.number.def(40)
  },
  data() {
    return {
      qrcode: null
    };
  },
  methods: {
    create() {
      const { $props: props } = this;

      this.$nextTick(() => {
        const qrcode = new QRCode({
          text: props.value,
          render: props.tag,
          size: props.size,
          correctLevel: props.correctLevel,
          background: props.background,
          foreground: props.foreground,
          pdground: props.pdground,
          image: props.image,
          imageSize: props.imageSize,
        });

        this.$el.innerHTML = "";
        this.$el.appendChild(qrcode);
      });
    },
    destroy() {
      this.$el.removeChild(this.$el.firstChild);
    }
  },
  watch: {
    value(value) {
      this.create();
    },
    tag(value) {
      this.create();
    },
    size(value) {
      this.create();
    },
    correctLevel(value) {
      this.create();
    },
    background(value) {
      this.create();
    },
    foreground(value) {
      this.create();
    },
    image(value) {
      this.create();
    },
    imageSize(value) {
      this.create();
    }
  },
  mounted() {
    this.create();
  },
  beforeDestroy() {
    this.destroy();
  },
  render() {
    const { $props: props } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "qrcode");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    // style
    let styles = {};

    styles.el = {
      width: props.size + "px",
      height: props.size + "px"
    };

    // render
    return (
      <div class={classes.el} style={styles.el}></div>
    );
  }
};

export default VuiQrcode;