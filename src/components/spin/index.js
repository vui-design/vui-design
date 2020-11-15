import Vue from "vue";
import VuiSpin from "./src/spin";
import Popup from "vui-design/utils/popup";
import is from "vui-design/utils/is";

/**
* 默认配置
*/
const defaults = {
	size: "large",
	animation: "vui-spin-fade",
	getPopupContainer: () => document.body
};

/**
* 创建 Spin 实例
* @param {Object} options 
*/
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

/**
* 对外提供 spinning 接口
* @param {String/Object} options 
*/
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

/**
* 对外提供 install 接口，用于全局注册
* @param {Function} Vue 
*/
VuiSpin.install = function(Vue) {
	Vue.component(VuiSpin.name, VuiSpin);
};

export default VuiSpin;