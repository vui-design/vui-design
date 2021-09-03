import is from "../../../utils/is";
import guid from "../../../utils/guid";
import clone from "../../../utils/clone";
import getTargetByPath from "../../../utils/getTargetByPath";

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
* 获取选项数据的唯一键值
* @param {Object} option 选项
* @param {String} property 查询属性
*/
const getOptionKey = (option, property) => {
	let optionKey;

	if (is.string(property)) {
		const target = getTargetByPath(option, property);

		optionKey = target.value;
	}
	else if (is.function(property)) {
		optionKey = property(clone(option));
	}
	else {
		optionKey = guid();
	}

	return optionKey;
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

// 默认导出指定接口
export default {
	getOptionKey,
	getFilteredOptions
};