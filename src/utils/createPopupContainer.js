import is from "./is";

/**
 * 创建组件节点的输出位置
 * @returns {Element}
 */
export default function createPopupContainer(getter) {
	let root;

	if (is.function(getter)) {
		root = getter();
	}

	if (!root || !is.element(root)) {
		root = document.body;
	}

	return root;
};