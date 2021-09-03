import Vue from "vue";

const funProto = Function.prototype;
const objProto = Object.prototype;

const getPrototypeOf = Object.getPrototypeOf;
const getOwnPropertyNames = Object.getOwnPropertyNames;

const objToString = objProto.toString;
const hasOwnProperty = objProto.hasOwnProperty;
const funToString = funProto.toString;

const canUseSymbol = typeof Symbol === "function" && Symbol.for;
const reactElementType = canUseSymbol ? Symbol.for("react.element") : 0xeac7;

// 检查是否运行于服务器端
export const isServer = Vue.prototype.$isServer;

// 检查给定的值是否是 VNode
export const isVNode = function(node) {
	return node !== null && typeof node === "object" && hasOwnProperty.call(node, "componentOptions");
};

// 检查给定的值是否是 null
export const isNull = function(value) {
	return value === null;
};

// 检查给定的值是否是 undefined
export const isUndefined = function(value) {
	return value === void 0;
};

// 检查给定的值是否是 NaN
// 这和原生的 isNaN 函数不一样，如果变量是 undefined，原生的 isNaN 函数也会返回 true
export const isNaN = function(value) {
	return window.isNaN(value) && value !== value;
};

// 检查给定的值是否是数值
export const isNumber = function(value) {
	return objToString.call(value) === "[object Number]" && !isNaN(value);
};

// 检查给定的值是否是整数
export const isInteger = function(value) {
	return isNumber(value) && value % 1 === 0;
};

// 检查给定的值是否是小数
export const isDecimal = function(value) {
	return isNumber(value) && value % 1 !== 0;
};

// 检查给定的值是否是负数
export const isNegative = function(value) {
	return isNumber(value) && value < 0;
};

// 检查给定的值是否是正数
export const isPositive = function(value) {
	return isNumber(value) && value > 0;
};

// 检查给定的值是否是有限数
export const isFinite = window.isFinite || function(value) {
	return !isInfinite(value) && !isNaN(value);
};

// 检查给定的值是否是无限数
export const isInfinite = function(value) {
	return value === Infinity || value === -Infinity;
};

// 检查给定的值是否是字符串
export const isString = function(value) {
	return objToString.call(value) === "[object String]";
};

// 检查给定的值是否是 Char 字符
export const isChar = function(value) {
	return isString(value) && value.length === 1;
};

// 检查给定的值是否是布尔值
export const isBoolean = function(value) {
	return value === true || value === false || objToString.call(value) === "[object Boolean]";
};

// 检查给定的值是否是函数
export const isFunction = function(value) {
	return objToString.call(value) === "[object Function]" || typeof value === "function";
};

// 检查给定的值是否是正则表达式
export const isRegExp = function(value) {
	return objToString.call(value) === "[object RegExp]";
};

// 检查给定的值是否是日期对象
export const isDate = function(value) {
	return objToString.call(value) === "[object Date]";
};

// 检查给定的值是否是参数对象
export const isArguments = function(value) {
	return objToString.call(value) === "[object Arguments]" || (isObject(value) && "callee" in value);
};

// 检查给定的值是否是数组
export const isArray = Array.isArray || function(value) {
	return objToString.call(value) === "[object Array]";
};

// 检查给定的值是否是对象
export const isObject = function(value) {
	return !!value && typeof value === "object";
};

// 检查给定的值是否是纯对象，纯对象是指通过 {} 或 new Object() 声明的对象
export const isPlainObject = function(value) {
	if (!value || objToString.call(value) !== "[object Object]") {
		return false;
	}

	const prototype = getPrototypeOf(value);

	if (prototype === null) {
		return true;
	}

	const constructor = hasOwnProperty.call(prototype, "constructor") && prototype.constructor;

	return typeof constructor === "function" && funToString.call(constructor) === funToString.call(Object);
};

// 检查给定的值是否是 Promise 对象
export function isPromise(value) {
	return objToString.call(value) === "[object Promise]";
};

// 检查给定的值是否是 HTMLElement 元素
export const isElement = function(value) {
	return value && (value instanceof window.Node) && (value.nodeType === 1);
};

// 检查给定的值是否是错误元素
export const isError = function(value) {
	return objToString.call(value) === "[object Error]";
};

// 检查给定的值是否为空，可用于判断参数列表、数组、对象或字符串是否为空
export const isEmpty = function(value) {
	if (isObject(value)) {
		const length = getOwnPropertyNames(value).length;

		if (length === 0 || (length === 1 && isArray(value)) || (length === 2 && isArguments(value))) {
			return true;
		}

		return false;
	}

	return value === "";
};

// 检查给定的值是否存在
export const isExisty = function(value) {
	return value != null;
};

// 检查给定的值是否为假值
export const isFalsy = function(value) {
	return !value;
};

// 检查给定的值是否为真值
export const isTruthy = function(value) {
	return !isFalsy(value);
};

// 
export function isEffective(value) {
	return value !== null && value !== undefined && value !== "";
};

// 检查给定的值是否可以用于合并
export const isMergeableObject = function(value) {
	return isObject(value) && !(isRegExp(value) || isDate(value) || isReactElement(value));
};

// 
export default {
	server: isServer,
	vnode: isVNode,
	null: isNull,
	undefined: isUndefined,
	nan: isNaN,
	number: isNumber,
	integer: isInteger,
	decimal: isDecimal,
	negative: isNegative,
	positive: isPositive,
	finite: isFinite,
	infinite: isInfinite,
	string: isString,
	char: isChar,
	boolean: isBoolean,
	function: isFunction,
	regexp: isRegExp,
	date: isDate,
	arguments: isArguments,
	array: isArray,
	object: isObject,
	plainObject: isPlainObject,
	json: isPlainObject,
	promise: isPromise,
	element: isElement,
	error: isError,
	empty: isEmpty,
	existy: isExisty,
	falsy: isFalsy,
	truthy: isTruthy,
	effective: isEffective,
	mergeableObject: isMergeableObject
};