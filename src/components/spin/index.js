import Vue from "vue";
import VuiSpin from "./spin";
import Popup from "../../libs/popup";
import is from "../../utils/is";
import withInstall from "../../utils/withInstall";

const defaults = {
  size: "large",
  animation: "vui-spin-fade",
  getPopupContainer: () => document.body
};

const createSpinInstance = options => {
  // 创建 Spin 挂载的 html 根节点
  const container = options.getPopupContainer();
  const el = document.createElement("div");

  container.appendChild(el);

  delete options.getPopupContainer;

  // 创建 Spin 实例
  const component = {
    el,
    components: {
      VuiSpin
    },
    data() {
      const state = {
        ...options,
        visible: false
      };

      return {
        state
      };
    },
    methods: {
      spinning() {
        this.state.visible = true;
      },
      cancel() {
        this.state.visible = false;
      },
      handleAfterLeave() {
        this.$destroy();
        this.$el && this.$el.parentNode && this.$el.parentNode.removeChild(this.$el);
      }
    },
    render(h) {
      const { state, handleAfterLeave } = this;

      if (!state.visible) {
        return;
      }

      const attributes = {
        props: {
          fullscreen: true,
          size: state.size,
          delay: state.delay,
          indicator: state.indicator,
          message: state.message
        },
        style: {
          zIndex: Popup.nextZIndex(),
          background: state.background
        }
      };

      return (
        <transition appear name={state.animation} onAfterLeave={handleAfterLeave}>
          <VuiSpin {...attributes} />
        </transition>
      );
    }
  };

  return new Vue(component);
};

VuiSpin.spinning = function(options = {}) {
  if (is.server) {
    return;
  }

  if (!is.string(options) && !is.json(options)) {
    return;
  }

  if (is.string(options)) {
    options = {
      message: options
    };
  }

  options = {
    ...defaults,
    ...options
  };

  const instance = createSpinInstance(options);

  instance.spinning();

  return instance;
};

export { createProps } from "./spin";
export default withInstall(VuiSpin);