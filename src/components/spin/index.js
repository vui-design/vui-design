import Vue from "vue";
import VuiSpin from "./src/spin";
import Popup from "vui-design/utils/popup";
import is from "vui-design/utils/is";

/**
* 默认配置
*/
const defaults = {
	size: "large",
	getPopupContainer: () => document.body
};

/**
* 创建 Spin 实例
* @param {Object} options 
*/
const createSpinInstance = options => {
	// 创建 Spin 挂载的 html 根节点
	let container = options.getPopupContainer();
	let el = document.createElement("div");

	container.appendChild(el);

	delete options.getPopupContainer;

	// 创建 Spin 实例
	return new Vue({
		el,
		components: {
			VuiSpin
		},
		data() {
			return {
				...options,
				visible: false
			};
		},
		methods: {
			open() {
				this.visible = true;
			},
			close() {
				this.visible = false;
			}
		},
		render(h) {
			let { visible, message, size, animation, render } = this;

			if (!visible) {
				return;
			}

			let attrs = {
				props: {
					fullscreen: true,
					message,
					size,
					animation
				},
				style: {
					zIndex: Popup.nextZIndex()
				}
			};

			let children;

			if (is.function(render)) {
				children = render(h);
			}

			return (
				<VuiSpin {...attrs}>{children}</VuiSpin>
			);
		}
	});
};

/**
* 对外提供 open 接口
* @param {String/Object} options 
*/
VuiSpin.open = function(options = {}) {
	if (is.server) {
		return;
	}

	if (!is.string(options) && !is.plainObject(options)) {
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

	let instance = createSpinInstance(options);

	instance.open();

	return instance;
};

/**
* 对外提供 install 接口，用于全局注册
* @param {Function} Vue 
*/
VuiSpin.install = function(Vue) {
	Vue.component(VuiSpin.name, VuiSpin);
};

export default VuiSpin;