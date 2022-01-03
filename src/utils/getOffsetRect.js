import getOffsetTop from "./getOffsetTop";
import getOffsetLeft from "./getOffsetLeft";

/**
* 获取目标元素距离容器顶部及左侧距离
* @param {HTMLElement} element 目标元素
* @param {Window|HTMLElement} container 容器
*/
export default function getOffsetRect(element, container) {
  const top = getOffsetTop(element, container);
  const left = getOffsetLeft(element, container);

  return {
    top,
    left
  };
};