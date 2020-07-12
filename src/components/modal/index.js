import Vue from "vue";
import VuiIcon from "vui-design/components/icon";
import VuiModal from "./src/modal";
import createChainedFunction from "vui-design/utils/createChainedFunction";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

/**
* 默认配置
*/
const defaults = {
	width: 360,
	getPopupContainer: () => document.body
};

/**
* 创建 Modal 实例
* @param {Object} options 
*/
const createModalInstance = function(options) {
	// 创建 Modal 挂载的 html 根节点
	let container = options.getPopupContainer();
	let el = document.createElement("div");

	container.appendChild(el);

	// 上述已创建 Modal 挂载的 html 根节点，这里对 getPopupContainer 选项进行重置，避免在组件实例化后又进行一次挂载
	options.getPopupContainer = () => false;

	// 创建 Modal 实例
	return new Vue({
		el,
		components: {
			VuiModal
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
			},
			update(options) {
				if (!is.plainObject(options)) {
					return;
				}

				for(let key in options) {
					this[key] = options[key];
				}
			},
			handleOpen() {

			},
			handleAfterOpen() {

			},
			handleClose() {

			},
			handleAfterClose() {
				this.$destroy();
				this.$el.parentNode && this.$el.parentNode.removeChild(this.$el);
			}
		},
		render(h) {
			let { type, icon, visible, showCancelButton, cancelButtonProps, cancelText, cancelAsync, showOkButton, okButtonProps, okText, okAsync, top, centered, width, className, backdrop, backdropClassName, animations, getPopupContainer } = this;
			let { onCancel, onOk, onOpen, onAfterOpen, onClose, onAfterClose, handleOpen, handleAfterOpen, handleClose, handleAfterClose } = this;

			let open = createChainedFunction(handleOpen.bind(this), onOpen);
			let afterOpen = createChainedFunction(handleAfterOpen.bind(this), onAfterOpen);
			let close = createChainedFunction(handleClose.bind(this), onClose);
			let afterClose = createChainedFunction(handleAfterClose.bind(this), onAfterClose);

			// attrs
			let attrs = {
				props: {
					visible,
					showNotice: true,
					showCancelButton,
					cancelButtonProps,
					cancelText,
					cancelAsync,
					showOkButton,
					okButtonProps,
					okText,
					okAsync,
					closable: false,
					top,
					centered,
					width,
					className,
					backdrop,
					backdropClassName,
					clickBackdropToClose: false,
					animations,
					getPopupContainer
				},
				on: {
					open,
					afterOpen,
					close,
					afterClose
				}
			};

			if (is.function(onCancel)) {
				attrs.on.cancel = onCancel;
			}

			if (is.function(onOk)) {
				attrs.on.ok = onOk;
			}

			// title
			let title = is.function(this.title) ? this.title(h) : this.title;

			// description
			let description = is.function(this.description) ? this.description(h) : this.description;

			// class
			let classNamePrefix = getClassNamePrefix(this.classNamePrefix, "modal-notice");
			let classes = {};

			classes.elNotice = {
				[`${classNamePrefix}`]: true,
				[`${classNamePrefix}-${type}`]: type
			};
			classes.elNoticeTitle = `${classNamePrefix}-title`;
			classes.elNoticeDescription = `${classNamePrefix}-description`;
			classes.elNoticeIcon = `${classNamePrefix}-icon`;

			// render
			let children = [];

			children.push(
				<div class={classes.elNoticeTitle}>{title}</div>
			);

			if (description) {
				children.push(
					<div class={classes.elNoticeDescription}>{description}</div>
				);
			}

			children.push(
				<div class={classes.elNoticeIcon}>
					<VuiIcon type={icon} />
				</div>
			);

			return (
				<VuiModal {...attrs}>
					<div class={classes.elNotice}>{children}</div>
				</VuiModal>
			);
		}
	});
};

/**
* 对外提供 info 接口
* @param {Object} options 
*/
VuiModal.info = function(options) {
	if (is.server) {
		return;
	}

	if (!is.plainObject(options)) {
		return;
	}

	options = {
		type: "info",
		icon: "info",
		...defaults,
		...options
	};

	options.showCancelButton = false;
	options.showOkButton = true;

	let instance = createModalInstance(options);

	instance.open();

	return instance;
};

/**
* 对外提供 warning 接口
* @param {Object} options 
*/
VuiModal.warning = function(options) {
	if (is.server) {
		return;
	}

	if (!is.plainObject(options)) {
		return;
	}

	options = {
		type: "warning",
		icon: "warning",
		...defaults,
		...options
	};

	options.showCancelButton = false;
	options.showOkButton = true;

	let instance = createModalInstance(options);

	instance.open();

	return instance;
};

/**
* 对外提供 success 接口
* @param {Object} options 
*/
VuiModal.success = function(options) {
	if (is.server) {
		return;
	}

	if (!is.plainObject(options)) {
		return;
	}

	options = {
		type: "success",
		icon: "checkmark-circle",
		...defaults,
		...options
	};

	options.showCancelButton = false;
	options.showOkButton = true;

	let instance = createModalInstance(options);

	instance.open();

	return instance;
};

/**
* 对外提供 error 接口
* @param {Object} options 
*/
VuiModal.error = function(options) {
	if (is.server) {
		return;
	}

	if (!is.plainObject(options)) {
		return;
	}

	options = {
		type: "error",
		icon: "crossmark-circle",
		...defaults,
		...options
	};

	options.showCancelButton = false;
	options.showOkButton = true;

	let instance = createModalInstance(options);

	instance.open();

	return instance;
};

/**
* 对外提供 confirm 接口
* @param {Object} options 
*/
VuiModal.confirm = function(options) {
	if (is.server) {
		return;
	}

	if (!is.plainObject(options)) {
		return;
	}

	options = {
		type: "confirm",
		icon: "help",
		...defaults,
		...options
	};

	options.showCancelButton = true;
	options.showOkButton = true;

	let instance = createModalInstance(options);

	instance.open();

	return instance;
};

/**
* 对外提供 install 接口，用于全局注册
* @param {Function} Vue 
*/
VuiModal.install = function(Vue) {
	Vue.component(VuiModal.name, VuiModal);
};

export default VuiModal;