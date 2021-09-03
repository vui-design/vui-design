import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import guid from "../../../utils/guid";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiWatermark = {
  name: "vui-watermark",
  props: {
    classNamePrefix: PropTypes.string,
    text: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    color: PropTypes.string.def("rgba(0, 0, 0, 0.15)"),
    fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def("14px"),
    fontFamily: PropTypes.string.def("Microsoft Yahei"),
    width: PropTypes.number.def(320),
    height: PropTypes.number.def(120),
    rotate: PropTypes.number.def(-20),
    rows: PropTypes.number.def(20)
  },
  data() {
    const state = {
      id: "vui-watermark-" + guid(),
      watermark: null
    };

    return {
      state
    };
  },
  methods: {
    create() {
        const { $props: props, state } = this;
        const canvas = document.createElement("canvas");
        const x = props.width / 2;
        const y = props.height / 2;

        canvas.width = props.width;
        canvas.height = props.height;

        const ctx = canvas.getContext("2d");

        ctx.font = "normal " + (is.string(props.fontSize) ? props.fontSize : (props.fontSize + "px")) + " " + props.fontFamily;
        ctx.fillStyle = props.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.translate(x, y);
        ctx.rotate(props.rotate * Math.PI / 180);
        ctx.translate(-x, -y);
        ctx.fillText(props.text, x, y);

        const src = canvas.toDataURL("image/png");

        this.watermark = document.createElement("div");
        this.watermark.id = state.id;
        this.watermark.style.pointerEvents = "none";
        this.watermark.style.position = "absolute";
        this.watermark.style.top = "0px";
        this.watermark.style.left = "0px";
        this.watermark.style.zIndex = 10000;
        this.watermark.style.width = "100%";
        this.watermark.style.height = "100%";

        let backgroundImages = [];
        let backgroundRepeats = [];
        let backgroundPositions = [];

        for (let i = 0; i < props.rows; i++) {
          backgroundImages.push("url(" + src + ")");
          backgroundRepeats.push("repeat-x");
          backgroundPositions.push((i % 2 === 0 ? 0 : (props.width / 2)) + "px " + (i * props.height) + "px");
        }

        this.watermark.style.backgroundImage = backgroundImages.join(", ");
        this.watermark.style.backgroundRepeat = backgroundRepeats.join(", ");
        this.watermark.style.backgroundPosition = backgroundPositions.join(", ");
        this.$el.appendChild(this.watermark);

        const observer = new MutationObserver((mutations, observer) =>{
          const mutation = mutations[0];

          if (mutation.target.id === state.id) {
            this.remove();
          }

          if (mutation.attributeName === "id") {
            this.remove();
            this.create();
          }

          if (mutation.removedNodes[0] && mutation.removedNodes[0].id === state.id) {
            this.create();
          }
        });
        const options = {
          childList: true,
          attributes: true,
          characterData: true,
          subtree: true,
          attributeOldValue: true,
          characterDataOldValue: true
        };

        observer.observe(this.$el, options);
      },
      destroy() {
        this.$el.removeChild(this.watermark);
      }
  },
  mounted() {
    this.create();
  },
  beforeDestroy() {
    this.destroy();
  },
  render() {
    const { $slots: slots, $props: props } = this;

    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "watermark");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    return (
      <div class={classes.el}>
        {slots.default}
      </div>
    );
  }
};

export default VuiWatermark;