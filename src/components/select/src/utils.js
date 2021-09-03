import is from "../../../utils/is";

/**
* 默认配置
*/
const defaults = {
  filter: (keyword, option, property) => {
    if (!keyword) {
      return true;
    }

    const regexper = new RegExp(String(keyword).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "i");

    if (property === "label" || property === "value") {
      return regexper.test(option[property]);
    }
    else if (property === "children") {
      return regexper.test(getTextFromChildren(option.children));
    }
  }
};

/**
* 判断输入的关键词是否是一个已经存在的选项
* @param {String} keyword 关键词
* @param {Array} options 选项列表
*/
export const isExisted = (keyword, options) => {
  options = getFlattenedOptions(options);

  return options.some(option => {
    return option.label === keyword || option.value === keyword || getTextFromChildren(option.children) === keyword;
  });
};

/**
* 从 children 中解析获取 options 选项列表
* @param {Array} children 子组件
* @param {Boolean} parent 父级
*/
export const getOptionsFromChildren = (children, parent) => {
  let options = [];

  if (!is.array(children)) {
    return options;
  }

  children.forEach(node => {
    if (!node) {
      return;
    }

    const component = node.componentOptions;

    if (!component || !component.Ctor) {
      return;
    }

    const config = component.Ctor.options;
    const props = component.propsData;

    if (!config || !props) {
      return;
    }

    let option = {
      ...props
    };
    let disabled;

    if (parent && parent.disabled) {
      disabled = parent.disabled;
    }
    else {
      disabled = option.disabled;
    }

    if (disabled === undefined || disabled === null || disabled === false) {
      option.disabled = false;
    }
    else {
      option.disabled = true;
    }

    if (config.name === "vui-option-group") {
      option.type = "option-group";
      option.children = getOptionsFromChildren(component.children, option);
    }
    else if (config.name === "vui-option") {
      option.type = "option";
      option.children = component.children;
    }

    options.push(option);
  });

  return options;
};

/**
* 获取子组件的文本内容
* @param {Array} children 子组件
*/
export const getTextFromChildren = children => {
  let text = "";

  if (!children || !children.length) {
    return text;
  }

  if (is.string(children)) {
    return children;
  }

  children.forEach(node => {
    if (!node) {
      return;
    }

    if (node.text) {
      text += node.text;
    }

    if (node.children && node.children.length) {
      text += getTextFromChildren(node.children);
    }
  });

  return text;
};

/**
* 将 options 选项列表转换为一维数组形式
* @param {Array} options 选项列表
*/
export const getFlattenedOptions = options => {
  let array = [];

  options.forEach(element => {
    if (element.type === "option-group") {
      array.push.apply(array, getFlattenedOptions(element.children));
    }
    else if (element.type === "option" || element.type === "keyword") {
      array.push(element);
    }
  });

  return array;
};

/**
* 根据搜索关键字 keyword 筛选 options 选项选项
* @param {String} keyword 搜索关键字
* @param {Array} options 选项列表
* @param {Function} filter 筛选函数
* @param {String} property 筛选属性
*/
export const getFilteredOptions = (keyword, options, filter, property) => {
  const predicate = is.function(filter) ? filter : defaults.filter;
  let array = [];

  options.forEach(element => {
    if (element.type === "option-group") {
      const optgroup = {
        ...element,
        children: getFilteredOptions(keyword, element.children, filter, property)
      };

      if (optgroup.children.length) {
        array.push(optgroup);
      }
    }
    else if (element.type === "option") {
      if (!predicate(keyword, element, property)) {
        return;
      }

      const option = {
        ...element
      };

      array.push(option);
    }
  });

  return array;
};

/**
* 根据选中值及选项列表获取选中的选项列表（单选）
* @param {Array} value 选中值
* @param {Array} options 选项
* @param {Array} selectedOption 历史选中项
* @param {Boolean} multiple 是否为多选模式
*/
export const getSelectedOptionByValue = (value, options, selectedOption) => {
  if (is.undefined(value)) {
    return;
  }

  options = getFlattenedOptions(options);

  const option = options.find(option => option.value === value);

  if (option) {
    return option;
  }

  if (selectedOption && selectedOption.value === value) {
    return selectedOption;
  }

  if (is.string(value) && is.falsy(value)) {
    return;
  }

  return {
    type: "option",
    value: value,
    disabled: false,
    children: value
  };
};

/**
* 根据选中值及选项列表获取选中的选项列表（多选）
* @param {Array} value 选中值
* @param {Array} selectedOptions 选中项
* @param {Array} options 选项
*/
export const getSelectedOptionsByValue = (value, options, selectedOptions) => {
  let array = [];

  if (is.array(value)) {
    value.forEach(element => {
      let selectedOption;

      if (selectedOptions && selectedOptions.length) {
        selectedOption = selectedOptions.find(selectedOption => selectedOption.value === element);
      }

      const option = getSelectedOptionByValue(element, options, selectedOption);

      if (!option) {
        return;
      }

      array.push(option);
    });
  }

  return array;
};

/**
* 默认导出指定接口
*/
export default {
  isExisted,
  getOptionsFromChildren,
  getTextFromChildren,
  getFlattenedOptions,
  getFilteredOptions,
  getSelectedOptionsByValue,
  getSelectedOptionByValue
};