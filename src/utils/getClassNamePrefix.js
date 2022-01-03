import Vue from "vue";

/**
* 获取组件 class 样式类名
* @param {String} customizedClassNamePrefix 自定义样式类名的前缀
* @param {String} componentName 组件名称
*/
export default function getClassNamePrefix(customizedClassNamePrefix, componentName) {
  let classNamePrefix = customizedClassNamePrefix;

  if (!classNamePrefix) {
    const vui = Vue.prototype.$vui;

    if (vui && vui.classNamePrefix) {
      classNamePrefix = vui.classNamePrefix;
    }
    else {
      classNamePrefix = "vui";
    }
  }

  return classNamePrefix + "-" + componentName;
};