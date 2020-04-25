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
let hiddenTextarea = null;

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

export default function calculateNodeHeight(targetElement, minRows = 2, maxRows = null, useCache = false) {
	if (!hiddenTextarea) {
		hiddenTextarea = document.createElement("textarea");
		document.body.appendChild(hiddenTextarea);
	}

	if (targetElement.getAttribute("wrap")) {
		hiddenTextarea.setAttribute("wrap", targetElement.getAttribute("wrap"));
	}
	else {
		hiddenTextarea.removeAttribute('wrap');
	}

	let {
		boxSizing,
		border,
		padding,
		contextStyle
	} = calculateNodeStyle(targetElement, useCache);

	hiddenTextarea.setAttribute("style", `${contextStyle}; ${hiddenStyle}`);
	hiddenTextarea.value = targetElement.value || targetElement.placeholder || "";

	let height = hiddenTextarea.scrollHeight;
	let minHeight = 0;
	let maxHeight = Number.MAX_SAFE_INTEGER;
	let overflowY = "";

	if (boxSizing === "border-box") {
		height = height + border;
	}
	else if (boxSizing === "content-box") {
		height = height - padding;
	}

	if (minRows !== null || maxRows !== null) {
		hiddenTextarea.value = "";

		let singleRowHeight = hiddenTextarea.scrollHeight - padding;

		if (minRows !== null) {
			minHeight = singleRowHeight * minRows;

			if (boxSizing === "border-box") {
				minHeight = minHeight + border + padding;
			}

			height = Math.max(minHeight, height);
		}

		if (maxRows !== null) {
			maxHeight = singleRowHeight * maxRows;

			if (boxSizing === "border-box") {
				maxHeight = maxHeight + border + padding;
			}

			overflowY = height > maxHeight ? "auto" : "hidden";
			height = Math.min(maxHeight, height);
		}
	}

	if (!maxRows) {
		overflowY = "hidden";
	}

	document.body.removeChild(hiddenTextarea);
	hiddenTextarea = null;

	return {
		height: `${height}px`,
		minHeight: `${minHeight}px`,
		maxHeight: `${maxHeight}px`,
		overflowY
	};
};