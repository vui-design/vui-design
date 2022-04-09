import VuiLazyRender from "../../lazy-render";
import VuiResizeObserver from "../../resize-observer";
import Portal from "../../../directives/portal";
import Popup from "../../../libs/popup";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import getStyle from "../../../utils/getStyle";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiSelectDropdown = {
  name: "vui-select-dropdown",
  components: {
    VuiLazyRender,
    VuiResizeObserver
  },
  directives: {
    Portal
  },
  props: {
    classNamePrefix: PropTypes.string,
    visible: PropTypes.bool.def(false),
    placement: PropTypes.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"]).def("bottom-start"),
    autoWidth: PropTypes.bool.def(true),
    animation: PropTypes.string.def("vui-select-dropdown-scale"),
    getPopupReference: PropTypes.func.def(() => null),
    getPopupContainer: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(() => document.body)
  },
  methods: {
    register() {
      if (is.server || this.popup) {
        return;
      }

      const { $el: target, $props: props } = this;
      const reference = props.getPopupReference();
      const settings = {
        placement: props.placement
      };

      if (!reference || !target || !settings.placement) {
        return;
      }

      this.popup = new Popup(reference, target, settings);
      this.popup.target.style.zIndex = Popup.nextZIndex();

      const width = getStyle(reference, "width");

      if (props.autoWidth) {
        this.popup.target.style.width = "";
        this.popup.target.style.minWidth = width;
      }
      else {
        this.popup.target.style.width = width;
        this.popup.target.style.minWidth = "";
      }
    },
    unregister() {
      if (is.server || !this.popup) {
        return;
      }

      this.popup.destroy();
      this.popup = null;
    },
    reregister() {
      if (is.server || !this.popup) {
        return;
      }

      this.popup.update();

      const { $props: props } = this;
      const reference = props.getPopupReference();

      if (!reference) {
        return;
      }

      const width = getStyle(reference, "width");

      if (props.autoWidth) {
        this.popup.target.style.width = "";
        this.popup.target.style.minWidth = width;
      }
      else {
        this.popup.target.style.width = width;
        this.popup.target.style.minWidth = "";
      }
    },
    handleBeforeEnter() {
      this.$nextTick(() => this.register());
      this.$emit("beforeOpen");
    },
    handleAfterEnter() {
      this.$emit("afterOpen");
    },
    handleBeforeLeave() {
      this.$emit("beforeClose");
    },
    handleAfterLeave() {
      this.$nextTick(() => this.unregister());
      this.$emit("afterClose");
    },
    handleResize() {
      this.$nextTick(() => this.reregister());
    },
    handleMousedown(e) {
      e.preventDefault();
    }
  },
  render(h) {
    const { $slots: slots, $props: props } = this;
    const { handleBeforeEnter, handleAfterEnter, handleBeforeLeave, handleAfterLeave, handleResize, handleMousedown } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    // render
    return (
      <VuiLazyRender render={props.visible}>
        <VuiResizeObserver onResize={handleResize}>
          <transition appear name={props.animation} onBeforeEnter={handleBeforeEnter} onAfterEnter={handleAfterEnter} onBeforeLeave={handleBeforeLeave} onAfterLeave={handleAfterLeave}>
            <div v-portal={props.getPopupContainer} v-show={props.visible} class={classes.el} onMousedown={handleMousedown}>
              {slots.default}
            </div>
          </transition>
        </VuiResizeObserver>
      </VuiLazyRender> 
    );
  }
};

export default VuiSelectDropdown;