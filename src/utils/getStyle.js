/**
* 获取 HTMLElement 元素的指定样式
* @param {HTMLElement} element
* @param {String} property
*/
export default function getStyle(element, property) {
  let value = "";

  if (!element || !property) {
    return value;
  }

  if (property === "float") {
    property = "cssFloat";
  }

  try {
    value = element.style[property];

    if (value) {
      return value;
    }

    const computedStyle = document.defaultView.getComputedStyle(element, "");

    if (computedStyle) {
      return computedStyle[property] || value;
    }

    return value;
  }
  catch(e) {
    return element.style[property];
  }
};