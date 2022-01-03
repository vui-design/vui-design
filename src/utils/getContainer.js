import is from "./is";

/**
* 获取元素容器
* @param {Boolean|String|HTMLElement|Function} getter
*/
export default function getContainer(getter) {
  let container;

  if (is.boolean(getter) && getter) {
    container = document.body;
  }
  else if (is.string(getter)) {
    container = document.querySelector(getter);
  }
  else if (is.element(getter)) {
    container = getter;
  }
  else if (is.function(getter)) {
    container = getter();
  }

  return is.element(container) ? container : null;
};