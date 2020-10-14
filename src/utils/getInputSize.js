const contextStyleSettings = [
	"box-sizing",
	"width",
	"border-width",
	"padding-top",
	"padding-bottom",
	"padding-left",
	"padding-right",
	"font-size",
	"font-weight",
	"font-family",
	"font-variant",
	"line-height",
	"letter-spacing",
	"text-indent",
	"text-rendering",
	"text-transform"
];
const hiddenStyle = `
	position:absolute !important;
	z-index:-1000 !important;
	top:0 !important;
	left:0 !important;
	height:0 !important;
	min-height:0 !important;
	max-height:none !important;
	overflow:hidden !important;
	visibility:hidden !important;
`;

let computedStyleCache = {};
let hiddenInput = null;

export function calculateNodeStyle(node, useCache = false) {
	const key = node.getAttribute("id") || node.getAttribute("name");

	if (useCache && computedStyleCache[key]) {
		return computedStyleCache[key];
	}

	const style = window.getComputedStyle(node);

	const boxSizing = style.getPropertyValue("box-sizing") || style.getPropertyValue("-moz-box-sizing") || style.getPropertyValue("-webkit-box-sizing");
	const border = parseFloat(style.getPropertyValue("border-top-width")) + parseFloat(style.getPropertyValue("border-bottom-width"));
	const padding = parseFloat(style.getPropertyValue("padding-top")) + parseFloat(style.getPropertyValue("padding-bottom"));
	const contextStyle = contextStyleSettings.map(name => `${name}: ${style.getPropertyValue(name)}`).join("; ");

	const data = {
		boxSizing,
		border,
		padding,
		contextStyle
	};

	if (useCache && key) {
		computedStyleCache[key] = data;
	}

	return data;
};

/**
* 获取 Input 文本框的实时尺寸，用于文本框尺寸自适应
* @param {HTMLElement} targetElement 目标元素
* @param {Boolean} useCache 是否使用缓存
*/
export default function getInputSize(targetElement, useCache = false) {
	if (!hiddenInput) {
		hiddenInput = document.createElement("input");
		document.body.appendChild(hiddenInput);
	}

	const {
		boxSizing,
		border,
		padding,
		contextStyle
	} = calculateNodeStyle(targetElement, useCache);

	hiddenInput.setAttribute("style", `${contextStyle}; ${hiddenStyle}`);
	hiddenInput.value = targetElement.value || targetElement.placeholder || "";

	let width = hiddenInput.scrollWidth;

	if (boxSizing === "border-box") {
		width = width + border;
	}
	else if (boxSizing === "content-box") {
		width = width - padding;
	}

	document.body.removeChild(hiddenInput);
	hiddenInput = null;

	return {
		width: `${width}px`
	};
};