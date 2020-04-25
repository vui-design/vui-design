import Vue from "vue";

const $vui = Vue.prototype.$vui;
const globalClassNamePrefix = ($vui && $vui.classNamePrefix) || "vui";

/**
 * 获取组件 class 样式类名的前缀
* @param {String} classNamePrefix 自定义前缀
* @param {String} componentName 组件名称
 */
export default function getClassNamePrefix(classNamePrefix = globalClassNamePrefix, componentName) {
	return classNamePrefix + "-" + componentName;
};
