import Vue from "vue";
import VuiNotice from "./src/notice";
import createChainedFunction from "vui-design/utils/createChainedFunction";
import is from "vui-design/utils/is";

/**
 * 默认配置
 */
const defaults = {
	placement: "top-right",
	top: 20,
	bottom: 20,
	duration: 5,
	getPopupContainer: () => document.body
};

/**
* 存储已打开的 Notice，用于更新 top 或 bottom 属性
*/
const storage = {
	value: {
		"top-left": [],
		"top-right": [],
		"bottom-left": [],
		"bottom-right": []
	},
	addItem(item, placement) {
		let index = this.value[placement].indexOf(item);

		if (index > -1) {
			return;
		}

		this.value[placement].push(item);
	},
	removeItem(item, placement) {
		let index = this.value[placement].indexOf(item);

		if (index === -1) {
			return;
		}

		let length = this.value[placement].length;
		let distance = item.$el.offsetHeight + 15;

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

/**
* 创建 Notice 实例
* @param {Object} options 
*/
const createNoticeInstance = options => {
	// 创建 Notice 挂载的 html 根节点
	let container = options.getPopupContainer();
	let el = document.createElement("div");

	container.appendChild(el);

	// 根据之前已打开的 Notice 计算当前 Notice 的垂直位置
	let placement = options.placement;

	storage.value[placement].forEach(prev => {
		if (/^(top)(-left|-right)?$/g.test(placement)) {
			options.top += prev.$el.offsetHeight + 15
		}
		else if (/^(bottom)(-left|-right)?$/g.test(placement)) {
			options.bottom += prev.$el.offsetHeight + 15
		}
	});

	// 上述已创建 Notice 挂载的 html 根节点，这里对 getPopupContainer 选项进行重置，避免在组件实例化后又进行一次挂载
	options.getPopupContainer = () => false;

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
				storage.addItem(this, this.placement);
			},
			close() {
				this.visible = false;
				storage.removeItem(this, this.placement);
			},
			update(options) {
				if (!is.string(options) && !is.function(options) && !is.plainObject(options)) {
					return;
				}

				if (is.string(options) || is.function(options)) {
					options = {
						title: options
					};
				}

				for(let key in options) {
					this[key] = options[key];
				}
			},
			handleOpen() {
				storage.addItem(this, this.placement);
			},
			handleAfterOpen() {
				this.setTimeout();
			},
			handleClose() {
				storage.removeItem(this, this.placement);
			},
			handleAfterClose() {
				this.clearTimeout();
				this.$destroy();
				this.$el.parentNode && this.$el.parentNode.removeChild(this.$el);
			}
		},
		render(h) {
			let { type, title, description, icon, closable, closeText, placement, top, bottom, visible, animation, getPopupContainer } = this;
			let { onOpen, onAfterOpen, onClose, onAfterClose, handleOpen, handleAfterOpen, handleClose, handleAfterClose } = this;

			let open = createChainedFunction(handleOpen.bind(this), onOpen);
			let afterOpen = createChainedFunction(handleAfterOpen.bind(this), onAfterOpen);
			let close = createChainedFunction(handleClose.bind(this), onClose);
			let afterClose = createChainedFunction(handleAfterClose.bind(this), onAfterClose);

			let attrs = {
				props: {
					type,
					title,
					description,
					icon,
					closable,
					closeText,
					placement,
					top,
					bottom,
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
				<VuiNotice {...attrs} />
			);
		}
	});
};

/**
* 对外提供 open 接口
* @param {String/Object} options 
*/
VuiNotice.open = function(options) {
	if (is.server) {
		return;
	}

	if (!is.string(options) && !is.function(options) && !is.plainObject(options)) {
		return;
	}

	if (is.string(options) || is.function(options)) {
		options = {
			title: options
		};
	}

	options = {
		...defaults,
		...options
	};

	let instance = createNoticeInstance(options);

	instance.open();

	return instance;
};

/**
* 对外提供 info 接口
* @param {String/Object} options 
*/
VuiNotice.info = function(options) {
	if (is.server) {
		return;
	}

	if (!is.string(options) && !is.function(options) && !is.plainObject(options)) {
		return;
	}

	if (is.string(options) || is.function(options)) {
		options = {
			title: options
		};
	}

	options = {
		type: "info",
		icon: options.description ? "info" : "info-filled",
		...defaults,
		...options
	};

	let instance = createNoticeInstance(options);

	instance.open();

	return instance
};

/**
* 对外提供 warning 接口
* @param {String/Object} options 
*/
VuiNotice.warning = function(options) {
	if (is.server) {
		return;
	}

	if (!is.string(options) && !is.function(options) && !is.plainObject(options)) {
		return;
	}

	if (is.string(options) || is.function(options)) {
		options = {
			title: options
		};
	}

	options = {
		type: "warning",
		icon: options.description ? "warning" : "warning-filled",
		...defaults,
		...options
	};

	let instance = createNoticeInstance(options);

	instance.open();

	return instance
};

/**
* 对外提供 success 接口
* @param {String/Object} options 
*/
VuiNotice.success = function(options) {
	if (is.server) {
		return;
	}

	if (!is.string(options) && !is.function(options) && !is.plainObject(options)) {
		return;
	}

	if (is.string(options) || is.function(options)) {
		options = {
			title: options
		};
	}

	options = {
		type: "success",
		icon: options.description ? "checkmark-circle" : "checkmark-circle-filled",
		...defaults,
		...options
	};

	let instance = createNoticeInstance(options);

	instance.open();

	return instance
};

/**
* 对外提供 error 接口
* @param {String/Object} options 
*/
VuiNotice.error = function(options) {
	if (is.server) {
		return;
	}

	if (!is.string(options) && !is.function(options) && !is.plainObject(options)) {
		return;
	}

	if (is.string(options) || is.function(options)) {
		options = {
			title: options
		};
	}

	options = {
		type: "error",
		icon: options.description ? "crossmark-circle" : "crossmark-circle-filled",
		...defaults,
		...options
	};

	let instance = createNoticeInstance(options);

	instance.open();

	return instance
};

/**
* 对外提供 install 接口，用于全局注册
* @param {Function} Vue 
*/
VuiNotice.install = function(Vue) {
	Vue.component(VuiNotice.name, VuiNotice);
};

export default VuiNotice;