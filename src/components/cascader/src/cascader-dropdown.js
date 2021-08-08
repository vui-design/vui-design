import VuiLazyRender from "vui-design/components/lazy-render";
import VuiResizeObserver from "vui-design/components/resize-observer";
import Portal from "vui-design/directives/portal";
import Popup from "vui-design/utils/popup";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getStyle from "vui-design/utils/getStyle";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiCascaderDropdown = {
  name: "vui-cascader-dropdown",
  provide() {
    return {
      vuiCascaderDropdown: this
    };
  },
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
    animation: PropTypes.string.def("vui-cascader-dropdown-scale"),
    getPopupReference: PropTypes.func.def(() => null),
    getPopupContainer: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(() => document.body)
  },
  watch: {
    autoWidth(value) {
      this.$nextTick(() => this.reregister());
    }
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

      const width = getStyle(reference, "width");

      this.popup = new Popup(reference, target, settings);
      this.popup.target.style.zIndex = Popup.nextZIndex();
      this.popup.target.style.width = props.autoWidth ? "" : width;
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

      this.popup.target.style.width = props.autoWidth ? "" : width;
    },
    handleBeforeOpen() {
      this.$nextTick(() => this.register());
      this.$emit("beforeOpen");
    },
    handleAfterOpen() {
      this.$emit("afterOpen");
    },
    handleBeforeClose() {
      this.$emit("beforeClose");
    },
    handleAfterClose() {
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
    const { handleBeforeOpen, handleAfterOpen, handleBeforeClose, handleAfterClose, handleResize, handleMousedown } = this;

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    // render
    return (
      <VuiLazyRender status={props.visible}>
        <VuiResizeObserver onResize={handleResize}>
          <transition
            appear
            name={props.animation}
            onBeforeEnter={handleBeforeOpen}
            onAfterEnter={handleAfterOpen}
            onBeforeLeave={handleBeforeClose}
            onAfterLeave={handleAfterClose}
          >
            <div
              v-portal={props.getPopupContainer}
              v-show={props.visible}
              class={classes.el}
              onMousedown={handleMousedown}
            >
              {slots.default}
            </div>
          </transition>
        </VuiResizeObserver>
      </VuiLazyRender>
    );
  }
};

export default VuiCascaderDropdown;