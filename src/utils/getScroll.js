import is from "./is";

/**
* 获取容器水平方向或垂直方向的滚动距离
* @param {Window|HTMLElement} scrollContainer 滚动容器
* @param {Boolean} vertical 是否获取垂直方向的滚动距离，默认为 true
*/
export default function getScroll(scrollContainer, vertical = true) {
  if (typeof window === "undefined") {
    return 0;
  }

  const isWindow = scrollContainer === window;
  const key = vertical ? "pageYOffset" : "pageXOffset";
  const property = vertical ? "scrollTop" : "scrollLeft";

  let value = isWindow ? scrollContainer[key] : scrollContainer[property];

  if (isWindow && !is.number(value)) {
    value = window.document.documentElement[property];
  }

  return value;
};