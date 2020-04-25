// Thanks to: https://github.com/calebroseland/vue-dom-portal
const getRoot = node => node === true ? document.body : node;
const map = new Map();

const portal = {
	inserted(el, { value }) {
		let parentNode = el.parentNode;

		if (!parentNode) {
			return;
		}

		let comment = document.createComment("");
		let moved = false;

		// 当 value 为 false，或者本次移动的目前父节点等于原始父节点，或当前元素还处于隐藏状态时不做任何操作
		if (value === false || getRoot(value) === parentNode) {

		}
		// 执行移动操作
		else {
			parentNode.replaceChild(comment, el);
			getRoot(value).appendChild(el);

			moved = true;
		}

		if (!map.has(el)) {
			map.set(el, { parentNode, comment, moved });
		}
	},
	componentUpdated(el, { value }) {
		let { parentNode, comment, moved } = map.get(el);

		// 之前已被移动过
		if (moved) {
			// 当 value 为 false 时撤销移动，恢复到原来的位置
			if (value === false) {
				parentNode.replaceChild(el, comment);

				map.set(el, {
					...map.get(el),
					...{
						moved: false
					}
				});
			}
			// 当本次移动的目前父节点等于当前父节点时不做任何操作
			else if (getRoot(value) === el.parentNode) {

			}
			// 执行移动操作
			else {
				getRoot(value).appendChild(el);
			}
		}
		// 之前未被移动过
		else {
			// 当 value 为 false，或者本次移动的目前父节点等于原始父节点时不做任何操作
			if (value === false || getRoot(value) === parentNode) {

			}
			// 执行移动操作
			else {
				parentNode.replaceChild(comment, el);
				getRoot(value).appendChild(el);

				map.set(el, {
					...map.get(el),
					...{
						moved: true
					}
				});
			}
		}
	},
	unbind(el) {
		let { parentNode, comment, moved } = map.get(el);

		// 指令解绑时，如果之前已被移动过，则恢复到原来的位置
		if (moved) {
			parentNode.replaceChild(el, comment);
		}

		map.delete(el);
	}
};

export default portal;