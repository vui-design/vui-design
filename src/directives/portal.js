// Thanks to: https://github.com/calebroseland/vue-dom-portal
const objToString = Object.prototype.toString;
const isString = value => objToString.call(value) === "[object String]";
const isFunction = value => objToString.call(value) === "[object Function]" || typeof value === "function";
const isElement = value => value && (value instanceof window.Node) && (value.nodeType === 1);

const map = new Map();
const getContainer = (element, getter) => {
	if (getter === true) {
		return document.body;
	}

	let container = null;

	if (isString(getter)) {
		container = document.querySelector(getter);
	}
	else if (isFunction(getter)) {
		container = getter(element);
	}
	else if (isElement(getter)) {
		container = getter;
	}

	if (isElement(container)) {
		return container;
	}
	else {
		return element.parentNode;
	}
};

export default {
	inserted(element, binding) {
		const container = getContainer(element, binding.value);
		const homeplace = element.parentNode;
		const placeholder = document.createComment("");
		let moved = false;

		// 当 binding.value 为 false，或者本次移动的目前父节点等于原始父节点，或当前元素还处于隐藏状态时不做任何操作
		if (binding.value === false || container === homeplace) {

		}
		// 执行移动操作
		else {
			homeplace.replaceChild(placeholder, element);
			container.appendChild(element);
			moved = true;
		}

		map.set(element, { homeplace, placeholder, moved });
	},
	componentUpdated(element, binding) {
		const container = getContainer(element, binding.value);
		const history = map.get(element);
		const { homeplace, placeholder, moved } = history;

		// 之前已被移动过
		if (moved) {
			// 当 binding.value 为 false 时撤销移动，恢复到原来的位置
			if (binding.value === false) {
				homeplace.replaceChild(element, placeholder);

				map.set(element, {
					...history,
					moved: false
				});
			}
			// 当本次移动的目前父节点等于当前父节点时不做任何操作
			else if (container === element.parentNode) {

			}
			// 执行移动操作
			else {
				container.appendChild(element);
			}
		}
		// 之前未被移动过
		else {
			// 当 binding.value 为 false，或者本次移动的目前父节点等于原始父节点时不做任何操作
			if (binding.value === false || container === homeplace) {

			}
			// 执行移动操作
			else {
				homeplace.replaceChild(placeholder, element);
				container.appendChild(element);

				map.set(element, {
					...history,
					moved: true
				});
			}
		}
	},
	unbind(element) {
		const { homeplace, placeholder, moved } = map.get(element);

		// 指令解绑时，如果之前已被移动过，则恢复到原来的位置
		if (moved) {
			homeplace.replaceChild(element, placeholder);
		}

		map.delete(element);
	}
};