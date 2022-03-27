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
  return options.some(option => {
    return (option.type === "option" || option.type === "keyword") && (option.label === keyword || option.value === keyword || getTextFromChildren(option.children) === keyword);
  });
};

/**
* 从 children 中解析获取 options 选项列表
* @param {Array} children 子组件
* @param {Boolean} parent 父级
*/
export const getOptionsFromChildren = (children, level = 1, parent) => {
  let options = [];

  if (!is.array(children)) {
    return options;
  }

  children.forEach((node, index) => {
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
      ...props,
      key: parent ? `${parent.key}-${index}` : `${index}`,
      level: level
    };

    if (parent && parent.disabled) {
      option.disabled = parent.disabled;
    }

    if (option.disabled === undefined || option.disabled === null || option.disabled === false) {
      option.disabled = false;
    }

    if (config.name === "vui-option-group") {
      option.type = "option-group";
      option.children = getOptionsFromChildren(component.children, level + 1, option);

      options.push(option);
      options.push.apply(options, option.children);
    }
    else if (config.name === "vui-option") {
      option.type = "option";
      option.children = component.children;

      options.push(option);
    }
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
* @param {Array} option 历史选中项
* @param {Array} props 属性
*/
export const getSelectedOption = (value, option, props) => {
  if (is.undefined(value)) {
    return;
  }

  const target = props.options.find(target => (target.type === "option" || target.type === "keyword") && target.value === value);

  if (target) {
    return target;
  }

  if (option && option.value === value) {
    return option;
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
* @param {Array} options 历史选中项
* @param {Array} props 属性
*/
export const getSelectedOptions = (value, options, props) => {
  let array = [];

  if (is.array(value)) {
    value.forEach(element => {
      let option;

      if (options && options.length > 0) {
        option = options.find(target => target.value === element);
      }

      const target = getSelectedOption(element, option, props);

      if (!target) {
        return;
      }

      array.push(target);
    });
  }

  return array;
};

/**
* 根据选中值及选项列表获取组件内部状态值
* @param {Array} value 选中值
* @param {Array} selectedOptions 选中项
* @param {Array} props 属性
*/
export const getValueFromProps = (value, options, props) => {
  let getter;

  if (props.multiple) {
    getter = getSelectedOptions;
  }
  else {
    getter = getSelectedOption;
  }

  return getter(value, options, props);
};

/**
* 默认导出指定接口
*/
export default {
  isExisted,
  getOptionsFromChildren,
  getTextFromChildren,
  getFilteredOptions,
  getValueFromProps
};