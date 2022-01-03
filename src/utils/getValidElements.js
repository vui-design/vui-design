const isValidElement = function(element) {
  return element.tag || (element.text && element.text.trim());
};

/**
* 获取剔除空元素后的元素列表
* @param {Array} children 元素列表
*/
export default function getValidElements(children = []) {
  return children.filter(element => element && isValidElement(element)).map(element => {
    if (!element.tag && element.text && element.text.trim()) {
      return element.text.trim();
    }

    return element;
  });
};