import is from "../../../utils/is";
import clone from "../../../utils/clone";
import flatten from "../../../utils/flatten";

/**
* 默认配置
*/
const defaults = {
  filter: (keyword, option, property) => {
    if (!keyword) {
      return true;
    }

    const string = String(keyword);
    const value = option[property];

    return new RegExp(string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "i").test(value);
  }
};

/**
* 将 options 选项转为一维 map 结构
* @param {Array} value
* @param {Array} options 选项列表
* @param {String} valueKey 选项值对应的键名
* @param {String} childrenKey 选项子选项对应的键名
*/
const mapper = (options, parent, valueKey, childrenKey, map) => {
  options.forEach(option => {
    const value = option[valueKey];
    const children = option[childrenKey];

    map[value] = {
      option: option,
      parent: parent,
      children: children
    };

    if (children && children.length > 0) {
      mapper(children, option, valueKey, childrenKey, map);
    }
  });
};

export const getMap = (options, valueKey, childrenKey) => {
  let map = {};

  mapper(options, undefined, valueKey, childrenKey, map);

  return map;
};

/**
* 根据选项查找其父级选项
* @param {Object} option 选项
* @param {Object} parent 父级选项
* @param {Array} options 选项列表
* @param {String} valueKey 选项值对应的键名
* @param {String} childrenKey 选项子选项对应的键名
*/
export const getParent = (option, parent, options, valueKey, childrenKey) => {
  let target;

  for (let i = 0, length = options.length; i < length; i++) {
    if (options[i][valueKey] === option[valueKey]) {
      target = parent;
    }
    else if (options[i][childrenKey]) {
      target = getParent(option, options[i], options[i][childrenKey], valueKey, childrenKey);
    }

    if (target) {
      break;
    }
  }

  return target;
};

/**
* 根据 value 值获取 selectedKeys
* @param {Array} value
* @param {Object} props 属性
*/
const upward = (option, props, selectedKeys) => {
  const parent = getParent(option, undefined, props.options, props.valueKey, props.childrenKey);

  if (!parent) {
    return;
  }

  const siblings = parent[props.childrenKey];
  const isEveryChecked = siblings.every(sibling => selectedKeys.indexOf(sibling[props.valueKey]) > -1);

  if (!isEveryChecked) {
    return;
  }

  const value = parent[props.valueKey];
  const index = selectedKeys.indexOf(value);

  if (index === -1) {
    selectedKeys.push(value);
    upward(parent, props, selectedKeys);
  }
};

const downward = (option, props, selectedKeys) => {
  const children = option[props.childrenKey];

  if (!children || children.length === 0) {
    return;
  }

  children.forEach(child => {
    const value = child[props.valueKey];
    const index = selectedKeys.indexOf(value);

    if (index === -1) {
      selectedKeys.push(value);
    }

    downward(child, props, selectedKeys);
  });
};

export const getSelectedKeysByValue = (value, props) => {
  const options = flatten(props.options, props.childrenKey, true);
  let selectedKeys = [];

  value.forEach(key => {
    const option = options.find(option => option[props.valueKey] === key);

    if (!option) {
      return;
    }

    const index = selectedKeys.indexOf(key);

    if (index === -1) {
      selectedKeys.push(key);
    }

    upward(option, props, selectedKeys);
    downward(option, props, selectedKeys);
  });

  return selectedKeys;
};

/**
* 根据 selectedKeys 获取 value 值
* @param {Array} selectedKeys
* @param {Array} options 选项列表
* @param {String} valueKey 选项值对应的键名
* @param {String} childrenKey 选项子选项对应的键名
* @param {String} checkedStrategy 定义选中项回填的方式
*/
export const getValueBySelectedKeys = (selectedKeys, options, valueKey, childrenKey, checkedStrategy) => {
  const map = getMap(options, valueKey, childrenKey);
  let value = [];

  if (checkedStrategy === "all") {
    value = selectedKeys;
  }
  else if (checkedStrategy === "parent") {
    selectedKeys.forEach(selectedKey => {
      const target = map[selectedKey];

      if (!target) {
        return;
      }

      if (!target.parent) {
        value.push(selectedKey);
      }
      else if (target.parent && selectedKeys.indexOf(target.parent[valueKey]) === -1) {
        value.push(selectedKey);
      }
    });
  }
  else if (checkedStrategy === "children") {
    selectedKeys.forEach(selectedKey => {
      const target = map[selectedKey];

      if (!target) {
        return;
      }

      if (!target.children) {
        value.push(selectedKey);
      }
      else if (target.parent && selectedKeys.indexOf(target.parent[valueKey]) === -1) {
        value.push(selectedKey);
      }
    });
  }

  return value;
};

/**
* 根据选中值和选项列表判断是否处于全选状态
* @param {Array} selectedKeys 选中值
* @param {Array} options 选项列表
* @param {String} valueKey 选项值对应的键名
*/
export const getCheckedStatus = (selectedKeys, options, valueKey) => {
  if (selectedKeys.length === 0) {
    return false;
  }

  return options.every(option => selectedKeys.indexOf(option[valueKey]) > -1);
};

/**
* 根据选中值和子选项列表获取某个选项的 indeterminate 状态
* @param {Array} selectedKeys 选中值
* @param {Array} children 子选项列表
* @param {String} valueKey 选项值对应的键名
* @param {String} childrenKey 选项子选项对应的键名
*/
export const getIndeterminateStatus = (selectedKeys, children, valueKey, childrenKey) => {
  if (!children || children.length === 0) {
    return false;
  }

  const options = flatten(children, childrenKey, true);
  const optionKeys = options.map(option => option[valueKey]);
  const selectedOptionKeys = optionKeys.filter(optionKey => selectedKeys.indexOf(optionKey) > -1);
  const length = optionKeys.length;
  const selectedLength = selectedOptionKeys.length;

  return length > 0 && selectedLength > 0 && selectedLength < length;
};

/**
* 根据 keyword 关键字筛选 options 选项列表
* @param {Array} options 选项列表
* @param {String} keyword 关键字
* @param {Function} filter 筛选函数
* @param {String} property 查询属性
*/
export const getFilteredOptions = (options, keyword, filter, property) => {
  const predicate = is.function(filter) ? filter : defaults.filter;
  let array = [];

  options.forEach(option => {
    if (!predicate(keyword, option, property)) {
      return;
    }

    array.push(option);
  });

  return array;
};

/**
* 根据选中值获取对应的选项列表
* @param {Array} value 选中值
* @param {Array} options 选项列表
* @param {String} valueKey 选项值对应的键名
* @param {String} childrenKey 选项子选项对应的键名
*/
export const getSelectedOptions = (value, options, valueKey, childrenKey) => {
  let result = [];

  if (value.length === 0) {
    return result;
  }

  options = flatten(options, childrenKey, true);

  value.forEach(element => {
    const option = options.find(option => option[valueKey] === element);

    if (option) {
      result.push(option);
    }
  });

  return result;
};

// 默认导出指定接口
export default {
  getMap,
  getParent,
  getSelectedKeysByValue,
  getValueBySelectedKeys,
  getCheckedStatus,
  getIndeterminateStatus,
  getFilteredOptions,
  getSelectedOptions
};