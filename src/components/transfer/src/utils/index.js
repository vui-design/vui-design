import guid from "vui-design/utils/guid";
import clone from "vui-design/utils/clone";
import getTargetByPath from "vui-design/utils/getTargetByPath";
import is from "vui-design/utils/is";

/**
* 将字符串转义成正则表达式
* @param {String} value 字符串
*/
export const createRegexer = (value) => {
	return new RegExp(String(value).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "i");
};

/**
* 默认的选项筛选函数
* @param {Object} option 选项
* @param {String} keyword 关键字
* @param {String} property 查询属性
*/
export const defaultOptionFilter = (option, keyword, property) => {
	if (!keyword) {
		return true;
	}

	const comparator = createRegexer(keyword);

	return comparator.test(option[property]);
};

/**
* 获取选项数据的唯一键值
* @param {Object} option 选项
* @param {String} property 查询属性
*/
const getRowKey = (option, property) => {
	let rowKey;

	if (is.string(property)) {
		const target = getTargetByPath(option, property);

		rowKey = target.value;
	}
	else if (is.function(property)) {
		rowKey = property(clone(option));
	}
	else {
		rowKey = guid();
	}

	return rowKey;
};

/**
* 根据 keyword 关键字筛选 options 选项列表
* @param {Array} options 选项列表
* @param {String} keyword 关键字
* @param {Function} filter 筛选函数
* @param {String} property 查询属性
*/
export const getFilteredOptions = (options, keyword, filter, property) => {
	let array = [];
	let iterator = is.function(filter) ? filter : defaultOptionFilter;

	options.forEach(option => {
		if (!iterator(keyword, option, property)) {
			return;
		}

		array.push(option);
	});

	return array;
};

// 默认导出指定接口
export default {
	getRowKey,
	getFilteredOptions
};