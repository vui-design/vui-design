import Vue from "Vue";

const funProto = Function.prototype;
const objProto = Object.prototype;

const getPrototypeOf = Object.getPrototypeOf;

const objToString = objProto.toString;
const hasOwnProperty = objProto.hasOwnProperty;
const funToString = funProto.toString;

const canUseSymbol = typeof Symbol === "function" && Symbol.for;
const reactElementType = canUseSymbol ? Symbol.for("react.element") : 0xeac7;

// 检查是否运行于服务器端
export const isServer = Vue.prototype.$isServer;

// 检查给定的值是否是 VNode
export function isVNode(node) {
	return node !== null && typeof node === "object" && hasOwnProperty.call(node, "componentOptions");
};

// 检查给定的值是否是 dom 元素
export function isElement(value) {
	return !!(value && value.nodeType === 1);
};

// 检查给定的值是否是 null
export function isNull(value) {
	return value === null;
};

// 检查给定的值是否是 undefined
export function isUndefined(value) {
	return value === void 0;
};

// 检查给定的值是否是 NaN
// 这和原生的 isNaN 函数不一样，如果变量是 undefined，原生的 isNaN 函数也会返回 true
export function isNaN(value) {
	return isNumber(value) && isNaN(value);
};

// 检查给定的值是否是数值
export function isNumber(value) {
	return objToString.call(value) === "[object Number]";
};

// 检查给定的值是否是字符串
export function isString(value) {
	return objToString.call(value) === "[object String]";
};

// 检查给定的值是否是布尔值
export function isBoolean(value) {
	return value === true || value === false || objToString.call(value) === "[object Boolean]";
};

// 检查给定的值是否是正则表达式
export function isRegExp(value) {
	return objToString.call(value) === "[object RegExp]";
};

// 检查给定的值是否是日期对象
export function isDate(value) {
	return objToString.call(value) === "[object Date]";
};

// 检查给定的值是否是函数
export function isFunction(value) {
	return objToString.call(value) === "[object Function]" || typeof value === "function";
};

// 检查给定的值是否是数组
export function isArray(value) {
	return objToString.call(value) === "[object Array]";
};

// 检查给定的值是否是对象
export function isObject(value) {
	return !!value && typeof value === "object";
};

// 检查给定的值是否是纯对象，纯对象是指通过 {} 或 new Object() 声明的对象
export function isPlainObject(value) {
	if (!value || objToString.call(value) !== "[object Object]") {
		return false;
	}

	var prototype = getPrototypeOf(value);

	if (prototype === null) {
		return true;
	}

	var constructor = hasOwnProperty.call(prototype, "constructor") && prototype.constructor;

	return typeof constructor === "function" && funToString.call(constructor) === funToString.call(Object);
};

// 检查给定的值是否可以用于合并
export function isMergeableObject(value) {
	return isObject(value) && !(isRegExp(value) || isDate(value) || isReactElement(value));
};

// 
export default {
	server: isServer,
	vnode: isVNode,
	element: isElement,
	null: isNull,
	undefined: isUndefined,
	nan: isNaN,
	number: isNumber,
	string: isString,
	boolean: isBoolean,
	regexp: isRegExp,
	date: isDate,
	function: isFunction,
	array: isArray,
	object: isObject,
	plainObject: isPlainObject,
	mergeableObject: isMergeableObject
};
