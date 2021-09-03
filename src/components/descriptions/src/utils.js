import is from "../../../utils/is";

/**
* 从 children 中解析获取描述列表
* @param {Array} children 子组件
* @param {String} tagName 组件名称
*/
export const getDataFromChildren = (children, tagName = "vui-description") => {
  let data = [];

  if (!children) {
    return data;
  }

  children.forEach(node => {
    if (!node) {
      return;
    }

    const component = node.componentOptions;

    if (!component || !component.Ctor) {
      return;
    }

    const { tag, propsData: props, children: elements } = component;

    if (tag === tagName && is.json(props)) {
      data.push({
        ...props,
        children: elements
      });
    }
  });

  return data;
};

/**
* 默认导出指定接口
*/
export default {
  getDataFromChildren
};