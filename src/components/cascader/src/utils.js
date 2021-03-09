/**
* 获取选项键值属性
* @param {Object} customizedOptionKeys 用户自定义的选项键值属性
*/
const optionKeys = {
  label: "label",
  value: "value",
  children: "children",
  leaf: "leaf",
  disabled: "disabled"
};

export const getOptionKeys = customizedOptionKeys => {
  return {
    ...optionKeys,
    ...customizedOptionKeys
  };
};

/**
* 扁平化处理选项列表
* @param {Object} parent 父级选项
* @param {Array} options 选项列表
* @param {Object} optionKeys 选项键值属性
*/
export const flatten = (parent, options, optionKeys) => {
  const { label: labelKey, value: valueKey, children: childrenKey, disabled: disabledKey } = optionKeys;
  let list = [];

  options.forEach(option => {
    const label = option[labelKey];
    const value = option[valueKey];
    const children = option[childrenKey];
    const disabled = option[disabledKey];

    let item = {
      path: parent ? parent.path.concat(option) : [option],
      leaf: children ? false: true
    };

    item[labelKey] = parent ? (parent[labelKey] + " / " + label) : label;
    item[valueKey] = value;
    item[disabledKey] = (parent && parent[disabledKey]) || disabled;

    list.push(item);

    if (children) {
      list.push.apply(list, flatten(item, children, optionKeys));
    }
  });

  return list;
};

/**
* 选项过滤器
* @param {String} keyword 查询关键词
* @param {Object} option 选项
* @param {property} property 选项属性
*/
export const filter = (keyword, option, property) => {
  if (!keyword) {
    return true;
  }

  const comparator = new RegExp(String(keyword).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "i");

  return comparator.test(option[property]);
};

/**
* 以默认导出的方式导出所有接口或数据
*/
export default {
  optionKeys,
  getOptionKeys,
  flatten,
  filter
};