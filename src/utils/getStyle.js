/**
* 获取 element 元素的指定样式
* @param {HTMLElement} element
* @param {String} property
*/
export default function getStyle(element, property) {
	if (!element || !property) {
		return null;
	}

	if (property === "float") {
		property = "cssFloat";
	}

	try {
		const computed = document.defaultView.getComputedStyle(element, "");

		return element.style[property] || computed ? computed[property] : null;
	}
	catch(e) {
		return element.style[property];
	}
};