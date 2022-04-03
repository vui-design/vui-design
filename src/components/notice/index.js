import Vue from "vue";
import VuiNotice from "./src/notice";
import createChainedFunction from "../../utils/createChainedFunction";
import is from "../../utils/is";

/**
 * 默认配置
 */
const placements = ["top-left", "top-right", "bottom-left", "bottom-right"];
const defaults = {
  placement: placements[1],
  top: 24,
  bottom: 24,
  duration: 5,
  getPopupContainer: () => document.body
};

/**
* 存储已打开的 Notice，用于更新 top 或 bottom 属性
*/
const storage = {
  value: {},
  addItem: function(placement, item) {
    const index = this.value[placement].indexOf(item);

    if (index > -1) {
      return;
    }

    this.value[placement].push(item);
  },
  removeItem: function(placement, item) {
    let index = this.value[placement].indexOf(item);

    if (index === -1) {
      return;
    }

    const length = this.value[placement].length;
    const distance = item.$el.offsetHeight + 16;

    this.value[placement].splice(index, 1);

    while (index < length - 1) {
      let next = this.value[placement][index];

      if (/^(top)(-left|-right)?$/g.test(placement)) {
        next.top = next.top - distance;
      }
      else if (/^(bottom)(-left|-right)?$/g.test(placement)) {
        next.bottom = next.bottom - distance;
      }

      index++;
    }
  }
};

placements.forEach(placement => storage.value[placement] = []);

/**
* 创建 Notice 实例
* @param {Object} options 
*/
const createNoticeInstance = function(options) {
  // 创建 Notice 挂载的 html 根节点
  const container = options.getPopupContainer();
  const el = document.createElement("div");

  container.appendChild(el);

  // 根据之前已打开的 Notice 计算当前 Notice 的垂直位置
  const placement = options.placement;

  storage.value[placement].forEach(prev => {
    if (/^(top)(-left|-right)?$/g.test(placement)) {
      options.top += prev.$el.offsetHeight + 16;
    }
    else if (/^(bottom)(-left|-right)?$/g.test(placement)) {
      options.bottom += prev.$el.offsetHeight + 16;
    }
  });

  // 上述已创建 Notice 挂载的 html 根节点，这里对 getPopupContainer 选项进行重置，避免在组件实例化后又进行一次挂载
  options.getPopupContainer = false;

  // 创建 Notice 实例
  return new Vue({
    el,
    components: {
      VuiNotice
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
        storage.addItem(this.placement, this);
      },
      close() {
        this.visible = false;
        storage.removeItem(this.placement, this);
      },
      update(options) {
        if (!is.string(options) && !is.function(options) && !is.json(options)) {
          return;
        }

        if (is.string(options) || is.function(options)) {
          options = {
            title: options
          };
        }

        for (let key in options) {
          this[key] = options[key];
        }
      },
      handleOpen() {
        storage.addItem(this.placement, this);
      },
      handleAfterOpen() {
        this.setTimeout();
      },
      handleClose() {
        storage.removeItem(this.placement, this);
      },
      handleAfterClose() {
        this.clearTimeout();
        this.$destroy();
        this.$el.parentNode && this.$el.parentNode.removeChild(this.$el);
      }
    },
    render(h) {
      const { visible, type, title, description, icon, closable, closeText, placement, top, bottom, animation, getPopupContainer } = this;

      const open = createChainedFunction(this.handleOpen.bind(this), this.open || this.onOpen);
      const afterOpen = createChainedFunction(this.handleAfterOpen.bind(this), this.afterOpen || this.onAfterOpen);
      const close = createChainedFunction(this.handleClose.bind(this), this.close || this.onClose);
      const afterClose = createChainedFunction(this.handleAfterClose.bind(this), this.afterClose || this.onAfterClose);

      let attrs = {
        props: {
          visible,
          type,
          title,
          description,
          icon,
          closable,
          closeText,
          placement,
          top,
          bottom,
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
        <VuiNotice {...attrs} />
      );
    }
  });
};

/**
* 对外提供 open 接口
* @param {String/Function/Object} options 
*/
VuiNotice.open = function(options, type) {
  if (is.server) {
    return;
  }

  if (!is.string(options) && !is.function(options) && !is.json(options)) {
    return;
  }

  if (is.string(options) || is.function(options)) {
    options = {
      title: options
    };
  }

  if (type === "info") {
    options.type = type;
    options.icon = options.description ? "info" : "info-filled";
  }
  else if (type === "warning") {
    options.type = type;
    options.icon = options.description ? "warning" : "warning-filled";
  }
  else if (type === "success") {
    options.type = type;
    options.icon = options.description ? "checkmark-circle" : "checkmark-circle-filled";
  }
  else if (type === "error") {
    options.type = type;
    options.icon = options.description ? "crossmark-circle" : "crossmark-circle-filled";
  }

  options = {
    ...defaults,
    ...options
  };

  if (placements.indexOf(options.placement) === -1) {
    options.placement = defaults.placement;
  }

  const instance = createNoticeInstance(options);

  instance.open();

  return instance;
};

/**
* 对外提供 info 接口
* @param {String/Function/Object} options 
*/
VuiNotice.info = function(options) {
  return VuiNotice.open(options, "info");
};

/**
* 对外提供 warning 接口
* @param {String/Function/Object} options 
*/
VuiNotice.warning = function(options) {
  return VuiNotice.open(options, "warning");
};

/**
* 对外提供 success 接口
* @param {String/Function/Object} options 
*/
VuiNotice.success = function(options) {
  return VuiNotice.open(options, "success");
};

/**
* 对外提供 error 接口
* @param {String/Function/Object} options 
*/
VuiNotice.error = function(options) {
  return VuiNotice.open(options, "error");
};

/**
* 对外提供 install 接口，用于全局注册
* @param {Function} Vue 
*/
VuiNotice.install = function(Vue) {
  Vue.component(VuiNotice.name, VuiNotice);
};

export default VuiNotice;