import Vue from "vue";
import VuiMessage from "./message";
import is from "../../utils/is";
import createChainedFunction from "../../utils/createChainedFunction";
import withInstall from "../../utils/withInstall";

const defaults = {
  top: 24,
  duration: 3,
  getPopupContainer: () => document.body
};

const storage = {
  value: [],
  addItem: function(item) {
    const index = this.value.indexOf(item);

    if (index > -1) {
      return;
    }

    this.value.push(item);
  },
  removeItem: function(item) {
    let index = this.value.indexOf(item);

    if (index === -1) {
      return;
    }

    const length = this.value.length;
    const distance = item.$el.offsetHeight + 15;

    this.value.splice(index, 1);

    while (index < length - 1) {
      const next = this.value[index];

      next.top = next.top - distance;
      index++;
    }
  }
};

const createMessageInstance = function(options) {
  // 创建 Message 挂载的 html 根节点
  const container = options.getPopupContainer();
  const el = document.createElement("div");

  container.appendChild(el);

  // 根据之前已打开的 Message 计算当前 Message 的垂直位置
  storage.value.forEach(prev => {
    options.top += prev.$el.offsetHeight + 16;
  });

  // 上述已创建 Message 挂载的 html 根节点，这里对 getPopupContainer 选项进行重置，避免在组件实例化后又进行一次挂载
  options.getPopupContainer = () => false;

  // 创建 Message 实例
  return new Vue({
    el,
    components: {
      VuiMessage
    },
    data() {
      return {
        ...options,
        visible: false
      };
    },
    methods: {
      setTimeout() {
        if (this.duration <= 0) {
          return;
        }

        clearTimeout(this.timeout);
        this.timeout = setTimeout(this.close, this.duration * 1000);
      },
      clearTimeout() {
        if (!this.timeout) {
          return;
        }

        clearTimeout(this.timeout);
        this.timeout = null;
      },
      open() {
        this.visible = true;
        storage.addItem(this);
      },
      close() {
        this.visible = false;
        storage.removeItem(this);
      },
      update(options) {
        if (!is.string(options) && !is.function(options) && !is.json(options)) {
          return;
        }

        if (is.string(options) || is.function(options)) {
          options = {
            content: options
          };
        }

        for(let key in options) {
          this[key] = options[key];
        }
      },
      handleOpen() {
        storage.addItem(this);
      },
      handleAfterOpen() {
        this.setTimeout();
      },
      handleClose() {
        storage.removeItem(this);
      },
      handleAfterClose() {
        this.clearTimeout();
        this.$destroy();
        this.$el.parentNode && this.$el.parentNode.removeChild(this.$el);
      }
    },
    render(h) {
      const { type, content, icon, closable, background, closeText, top, visible, animation, getPopupContainer } = this;

      const open = createChainedFunction(this.handleOpen.bind(this), this.open || this.onOpen);
      const afterOpen = createChainedFunction(this.handleAfterOpen.bind(this), this.afterOpen || this.onAfterOpen);
      const close = createChainedFunction(this.handleClose.bind(this), this.close || this.onClose);
      const afterClose = createChainedFunction(this.handleAfterClose.bind(this), this.afterClose || this.onAfterClose);

      const attrs = {
        props: {
          type,
          content,
          icon,
          background,
          closable,
          closeText,
          top,
          visible,
          animation,
          getPopupContainer
        },
        on: {
          open,
          afterOpen,
          close,
          afterClose
        }
      };

      return (
        <VuiMessage {...attrs} />
      );
    }
  });
};

VuiMessage.open = function(options, type) {
  if (is.server) {
    return;
  }

  if (!is.string(options) && !is.function(options) && !is.json(options)) {
    return;
  }

  if (is.string(options) || is.function(options)) {
    options = {
      content: options
    };
  }

  if (type === "info") {
    options.type = type;
    options.icon = "info-filled";
  }
  else if (type === "warning") {
    options.type = type;
    options.icon = "warning-filled";
  }
  else if (type === "success") {
    options.type = type;
    options.icon = "checkmark-circle-filled";
  }
  else if (type === "error") {
    options.type = type;
    options.icon = "crossmark-circle-filled";
  }
  else if (type === "loading") {
    options.type = type;
    options.icon = "loading-filled";
  }

  options = {
    ...defaults,
    ...options
  };

  const instance = createMessageInstance(options);

  instance.open();

  return instance;
};

VuiMessage.info = function(options) {
  return VuiMessage.open(options, "info");
};

VuiMessage.warning = function(options) {
  return VuiMessage.open(options, "warning");
};

VuiMessage.success = function(options) {
  return VuiMessage.open(options, "success");
};

VuiMessage.error = function(options) {
  return VuiMessage.open(options, "error");
};

VuiMessage.loading = function(options) {
  return VuiMessage.open(options, "loading");
};

export { createProps } from "./message";
export default withInstall(VuiMessage);