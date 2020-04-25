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
	const reference = node.getAttribute("id") || node.getAttribute("name");

	if (useCache && computedStyleCache[reference]) {
		return computedStyleCache[reference];
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

	if (useCache && reference) {
		computedStyleCache[reference] = data;
	}

	return data;
};

export default function getInputSize(targetElement, useCache = false) {
	if (!hiddenInput) {
		hiddenInput = document.createElement("input");
		document.body.appendChild(hiddenInput);
	}

	let {
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