/**
* 获取 element 元素的指定样式
* @param {HTMLElement} element
* @param {String} style
*/
export default function getStyle(element, name) {
	if (!element || !name) {
		return null;
	}

	if (name === "float") {
		name = "cssFloat";
	}

	try {
		const computed = document.defaultView.getComputedStyle(element, "");

		return element.style[name] || computed ? computed[name] : null;
	}
	catch(e) {
		return element.style[name];
	}
};