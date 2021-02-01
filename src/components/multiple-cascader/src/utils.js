import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import flatten from "vui-design/utils/flatten";

/**
* 根据选中值列表获取对应的选项列表
* @param {Array} value 选中值列表
* @param {Array} options 选项列表
* @param {String} valueKey 值对应的属性名称
* @param {String} childrenKey 子选项对应的属性名称
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

/**
* 根据选中值和子选项列表获取某个选项的 indeterminate 状态
* @param {Array} value 选中值列表
* @param {Array} children 子选项列表
* @param {String} valueKey 值对应的属性名称
* @param {String} childrenKey 子选项对应的属性名称
*/
export const getIndeterminateStatus = (value, children, valueKey, childrenKey) => {
	if (!children || children.length === 0) {
		return false;
	}

	const options = flatten(children, childrenKey, true);
	const optionKeys = options.map(option => option[valueKey]);
	const selectedKeys = optionKeys.filter(optionKey => value.indexOf(optionKey) > -1);

	const length = optionKeys.length;
	const selectedLength = selectedKeys.length;

	return selectedLength > 0 && selectedLength < length;
};

/**
* 根据选中值列表和选项列表判断是否处于全选、半选或未选状态
* @param {Array} selectedKeys 选中值列表
* @param {Array} options 选项列表
* @param {String} valueKey 值对应的属性名称
*/
export const getSelectedStatus = (selectedKeys, options, valueKey) => {
	if (selectedKeys.length === 0) {
		return "none";
	}

	if (options.every(option => selectedKeys.indexOf(option[valueKey]) > -1)) {
		return "all";
	}

	return "part";
};

// 默认导出指定接口
export default {
	flatten,
	getSelectedOptions,
	getIndeterminateStatus,
	getSelectedStatus
};