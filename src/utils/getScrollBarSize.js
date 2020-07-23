/**
* 获取滚动条的尺寸
* @param {Boolean} fresh 是否每次调用都重新计算滚动条的尺寸
*/
import is from "./is";

let cached = undefined;

export default function getScrollbarSize(fresh) {
	if (is.server) {
		return 0;
	}

	if (fresh || cached === undefined) {
		let inner = document.createElement("div");
		let innerStyle = inner.style;

		innerStyle.width = "100%";
		innerStyle.height = "200px";

		let outer = document.createElement("div");
		let outerStyle = outer.style;

		outerStyle.position = "absolute";
		outerStyle.top = 0;
		outerStyle.left = 0;
		outerStyle.pointerEvents = "none";
		outerStyle.width = "200px";
		outerStyle.height = "150px";
		outerStyle.visibility = "hidden";

		outer.appendChild(inner);
		document.body.appendChild(outer);

		// 设置子元素超出部分隐藏
		outerStyle.overflow = "hidden";

		let width1 = inner.offsetWidth;

		// 设置子元素超出部分滚动
		outer.style.overflow = "scroll";

		let width2 = inner.offsetWidth;

		if (width1 === width2) {
			width2 = outer.clientWidth;
		}

		document.body.removeChild(outer);

		cached = width1 - width2;
	}

	return cached;
};