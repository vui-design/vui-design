import Vue from "vue";
import VuiMessage from "./src/message";
import createChainedFunction from "vui-design/utils/createChainedFunction";
import is from "vui-design/utils/is";

/**
* 默认配置
*/
const defaults = {
	top: 20,
	duration: 3,
	getPopupContainer: () => document.body
};

/**
* 存储已打开的 Message，用于更新 top 属性
*/
const storage = {
	value: [],
	addItem(item) {
		const index = this.value.indexOf(item);

		if (index > -1) {
			return;
		}

		this.value.push(item);
	},
	removeItem(item) {
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

/**
* 创建 Message 实例
* @param {Object} options 
*/
const createMessageInstance = options => {
	// 创建 Message 挂载的 html 根节点
	const container = options.getPopupContainer();
	const el = document.createElement("div");

	container.appendChild(el);

	// 根据之前已打开的 Message 计算当前 Message 的垂直位置
	storage.value.forEach(prev => {
		options.top += prev.$el.offsetHeight + 15;
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
				if (!is.string(options) && !is.function(options) && !is.plainObject(options)) {
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
			const { type, content, icon, closable, closeText, top, visible, animation, getPopupContainer } = this;

			const open = createChainedFunction(this.handleOpen.bind(this), this.open || this.onOpen);
			const afterOpen = createChainedFunction(this.handleAfterOpen.bind(this), this.afterOpen || this.onAfterOpen);
			const close = createChainedFunction(this.handleClose.bind(this), this.close || this.onClose);
			const afterClose = createChainedFunction(this.handleAfterClose.bind(this), this.afterClose || this.onAfterClose);

			const attrs = {
				props: {
					type,
					content,
					icon,
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

/**
* 对外提供 open 接口
* @param {String/Object} options
*/
VuiMessage.open = options => {
	if (is.server) {
		return;
	}

	if (!is.string(options) && !is.function(options) && !is.plainObject(options)) {
		return;
	}

	if (is.string(options) || is.function(options)) {
		options = {
			content: options
		};
	}

	options = {
		...defaults,
		...options
	};

	const instance = createMessageInstance(options);

	instance.open();

	return instance;
};

/**
* 对外提供 info 接口
* @param {String/Object} options 
*/
VuiMessage.info = options => {
	if (is.server) {
		return;
	}

	if (!is.string(options) && !is.function(options) && !is.plainObject(options)) {
		return;
	}

	if (is.string(options) || is.function(options)) {
		options = {
			content: options
		};
	}

	options = {
		type: "info",
		icon: "info-filled",
		...defaults,
		...options
	};

	const instance = createMessageInstance(options);

	instance.open();

	return instance;
};

/**
* 对外提供 warning 接口
* @param {String/Object} options 
*/
VuiMessage.warning = options => {
	if (is.server) {
		return;
	}

	if (!is.string(options) && !is.function(options) && !is.plainObject(options)) {
		return;
	}

	if (is.string(options) || is.function(options)) {
		options = {
			content: options
		};
	}

	options = {
		type: "warning",
		icon: "warning-filled",
		...defaults,
		...options
	};

	const instance = createMessageInstance(options);

	instance.open();

	return instance;
};

/**
* 对外提供 success 接口
* @param {String/Object} options 
*/
VuiMessage.success = options => {
	if (is.server) {
		return;
	}

	if (!is.string(options) && !is.function(options) && !is.plainObject(options)) {
		return;
	}

	if (is.string(options) || is.function(options)) {
		options = {
			content: options
		};
	}

	options = {
		type: "success",
		icon: "checkmark-circle-filled",
		...defaults,
		...options
	};

	const instance = createMessageInstance(options);

	instance.open();

	return instance;
};

/**
* 对外提供 error 接口
* @param {String/Object} options 
*/
VuiMessage.error = options => {
	if (is.server) {
		return;
	}

	if (!is.string(options) && !is.function(options) && !is.plainObject(options)) {
		return;
	}

	if (is.string(options) || is.function(options)) {
		options = {
			content: options
		};
	}

	options = {
		type: "error",
		icon: "crossmark-circle-filled",
		...defaults,
		...options
	};

	const instance = createMessageInstance(options);

	instance.open();

	return instance;
};

/**
* 对外提供 loading 接口
* @param {String/Object} options 
*/
VuiMessage.loading = options => {
	if (is.server) {
		return;
	}

	if (!is.string(options) && !is.function(options) && !is.plainObject(options)) {
		return;
	}

	if (is.string(options) || is.function(options)) {
		options = {
			content: options
		};
	}

	options = {
		type: "loading",
		icon: "loading",
		...defaults,
		...options
	};

	const instance = createMessageInstance(options);

	instance.open();

	return instance;
};

/**
* 对外提供 install 接口，用于全局注册
* @param {Function} Vue 
*/
VuiMessage.install = function(Vue) {
	Vue.component(VuiMessage.name, VuiMessage);
};

export default VuiMessage;