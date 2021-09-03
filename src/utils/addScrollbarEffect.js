import getScrollbarSize from "./getScrollbarSize";

/**
* Modal、Drawer 等弹窗组件弹出时，添加滚动条占位符
*/
export default function addScrollbarEffect() {
	let fullWindowWidth = window.innerWidth;

	// workaround for missing window.innerWidth in IE8
	if (!fullWindowWidth) {
		const documentElementRect = document.documentElement.getBoundingClientRect();

		fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left);
	}

	const bodyIsOverflowed = document.body.clientWidth < fullWindowWidth;
	let size;

	if (bodyIsOverflowed) {
		size = getScrollbarSize();
	}

	if (!bodyIsOverflowed || !size) {
		return;
	}

	document.body.style.paddingRight = `${size}px`;
	document.body.style.overflow = "hidden";

	return {
		remove() {
			document.body.style.paddingRight = "";
			document.body.style.overflow = "";
		}
	};
};