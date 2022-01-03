/**
* 获取目标元素距离容器左侧的距离
* @param {HTMLElement} element 目标元素
* @param {Window|HTMLElement} container 容器
*/
export default function getOffsetLeft(element, container) {
  if (!element) {
    return 0;
  }

  if (!element.getClientRects().length) {
    return 0;
  }

  const rect = element.getBoundingClientRect();

  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument.documentElement;

      return rect.left - container.clientLeft;
    }

    return rect.left - container.getBoundingClientRect().left;
  }

  return rect.left;
};