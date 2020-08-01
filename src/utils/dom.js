import is from "./is";

const ie = is.server ? 0 : Number(document.documentMode);
const trim = string => (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
const camelcase = name => name.replace(/([\:\-\_]+(.))/g, (match, separator, letter, offset) => offset ? letter.toUpperCase() : letter).replace(/^moz([A-Z])/, "Moz$1");

// 绑定事件
export const on = (function() {
	if (!is.server && document.addEventListener) {
		return function(element, event, handler) {
			if (element && event && handler) {
				element.addEventListener(event, handler, false);
			}
		};
	}
	else {
		return function(element, event, handler) {
			if (element && event && handler) {
				element.attachEvent("on" + event, handler);
			}
		};
	}
})();

// 注销事件
export const off = (function() {
	if (!is.server && document.removeEventListener) {
		return function(element, event, handler) {
			if (element && event) {
				element.removeEventListener(event, handler, false);
			}
		};
	}
	else {
		return function(element, event, handler) {
			if (element && event) {
				element.detachEvent("on" + event, handler);
			}
		};
	}
})();

// 绑定一次性事件
export const once = function(element, event, callback) {
	const handler = function() {
		if (callback) {
			callback.apply(this, arguments);
		}

		off(element, event, handler);
	};

	on(element, event, handler);
};

// 判断给定元素是否含有特定的 class 样式类名
export function hasClass(element, className) {
	if (!element || !className) {
		return false;
	}

	if (className.indexOf(" ") !== -1) {
		throw new Error("className should not contain space.");
	}

	if (element.classList) {
		return element.classList.contains(className);
	}
	else {
		return (" " + element.className + " ").indexOf(" " + className + " ") > -1;
	}
};

// 为给定的元素添加特定的 class 样式类名
export function addClass(element, className) {
	if (!element) {
		return;
	}

	let currentClassNames = trim(el.className).split(" ");
	let classNames = [];

	if (className) {
		classNames = className.split(" ");
	}

	for (let i = 0, length = classNames.length; i < length; i++) {
		const value = classNames[i];

		if (!value) {
			continue;
		}

		if (element.classList) {
			element.classList.add(value);
		}
		else if (!hasClass(element, value)) {
			currentClassNames.push(value);
		}
	}

	if (!element.classList) {
		element.className = currentClassNames.join(" ");
	}
};

// 为给定的元素去除特定的 class 样式类名
export function removeClass(element, className) {
	if (!element || !className) {
		return;
	}

	let currentClassNames = " " + element.className + " ";
	let classNames = className.split(" ");

	for (let i = 0, length = classNames.length; i < length; i++) {
		const value = classNames[i];

		if (!value) {
			continue;
		}

		if (element.classList) {
			element.classList.remove(value);
		}
		else if (hasClass(element, value)) {
			currentClassNames = currentClassNames.replace(" " + value + " ", " ");
		}
	}

	if (!element.classList) {
		element.className = trim(currentClassNames);
	}
};

// 获取给定的元素的特定 style 样式
export const getStyle = ie < 9 ? function(element, styleName) {
	if (is.server) {
		return;
	}

	if (!element || !styleName) {
		return null;
	}

	styleName = camelcase(styleName);

	if (styleName === "float") {
		styleName = "styleFloat";
	}

	try {
		switch(styleName) {
			case "opacity":
				try {
					return element.filters.item("alpha").opacity / 100;
				}
				catch(e) {
					return 1.0;
				}
			default:
				return (element.style[styleName] || element.currentStyle ? element.currentStyle[styleName] : null);
		}
	}
	catch(e) {
		return element.style[styleName];
	}
} : function(element, styleName) {
	if (is.server) {
		return;
	}

	if (!element || !styleName) {
		return null;
	}

	styleName = camelcase(styleName);

	if (styleName === "float") {
		styleName = "cssFloat";
	}

	try {
		var computed = document.defaultView.getComputedStyle(element, "");

		return element.style[styleName] || computed ? computed[styleName] : null;
	}
	catch(e) {
		return element.style[styleName];
	}
};

// 设置给定的元素的特定 style 样式
export function setStyle(element, styleName, value) {
	if (!element || !styleName) {
		return;
	}

	if (typeof styleName === "object") {
		for (let prop in styleName) {
			if (styleName.hasOwnProperty(prop)) {
				setStyle(element, prop, styleName[prop]);
			}
		}
	}
	else {
		styleName = camelcase(styleName);

		if (styleName === "opacity" && ie < 9) {
			element.style.filter = isNaN(value) ? "" : "alpha(opacity=" + value * 100 + ")";
		}
		else {
			element.style[styleName] = value;
		}
	}
};

// 判断给定的元素内容是否可滚动
export function isScrollable(element, vertical) {
	if (is.server) {
		return;
	}

	const determinedDirection = vertical !== null || vertical !== undefined;
	const overflow = determinedDirection ? vertical ? getStyle(element, "overflow-y") : getStyle(element, "overflow-x") : getStyle(element, "overflow");

	return overflow.match(/(scroll|auto)/);
};

// 判断给定的元素是否在特定容器的可见范围内
export function isInContainer(element, container) {
	if (is.server || !element || !container) {
		return false;
	}

	const rect = element.getBoundingClientRect();
	let boundary;

	if ([window, document, document.documentElement, null, undefined].includes(container)) {
		boundary = {
			top: 0,
			left: 0,
			right: window.innerWidth,
			bottom: window.innerHeight
		};
	}
	else {
		boundary = container.getBoundingClientRect();
	}

	return rect.top < boundary.bottom && rect.bottom > boundary.top && rect.right > boundary.left && rect.left < boundary.right;
};

// 获取给定的元素的滚动父容器
export function getScrollContainer(element, vertical) {
	if (is.server) {
		return;
	}

	let parent = element;

	while(parent) {
		if ([window, document, document.documentElement].includes(parent)) {
			return window;
		}

		if (isScrollable(parent, vertical)) {
			return parent;
		}

		parent = parent.parentNode;
	}

	return parent;
};