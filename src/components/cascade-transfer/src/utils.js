import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import flatten from "vui-design/utils/flatten";

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

/**
* 根据 value 值获取 selectedKeys
* @param {Array} value
* @param {Array} options 选项列表
* @param {String} valueKey 选项值对应的键名
* @param {String} childrenKey 选项子选项对应的键名
*/
export const mapValueToSelectedKeys = (value, options, valueKey, childrenKey) => {
	const map = getMap(options, valueKey, childrenKey);
	let selectedKeys = [];

	value.forEach(key => {
		const target = map[key];

		selectedKeys.push(key);

		if (target.children && target.children.length > 0) {
			const children = flatten(target.children, childrenKey, true);

			children.forEach(child => {
				if (selectedKeys.indexOf(child[valueKey]) === -1) {
					selectedKeys.push(child[valueKey]);
				}
			});
		}
	});

	return selectedKeys;
};

/**
* 根据 selectedKeys 获取 value 值
* @param {Array} selectedKeys
* @param {Array} options 选项列表
* @param {String} valueKey 选项值对应的键名
* @param {String} childrenKey 选项子选项对应的键名
*/
export const mapSelectedKeysToValue = (selectedKeys, options, valueKey, childrenKey) => {
	const map = getMap(options, valueKey, childrenKey);
	let value = [];

	selectedKeys.forEach(selectedKey => {
		const target = map[selectedKey];

		if (!target.parent) {
			value.push(selectedKey);
		}
		else if (target.parent && selectedKeys.indexOf(target.parent[valueKey]) === -1) {
			value.push(selectedKey);
		}
	});

	return value;
};

/**
* 根据 value 值获取 selectedKeys
* @param {Array} value
* @param {Array} options 选项列表
* @param {String} valueKey 选项值对应的键名
* @param {String} childrenKey 选项子选项对应的键名
*/
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
* 根据选中值和选项列表判断是否处于全选、半选或未选状态
* @param {Array} selectedKeys 选中值
* @param {Array} options 选项列表
* @param {String} valueKey 选项值对应的键名
*/
export const getCheckedStatus = (selectedKeys, options, valueKey) => {
	if (selectedKeys.length === 0) {
		return "none";
	}

	if (options.every(option => selectedKeys.indexOf(option[valueKey]) > -1)) {
		return "all";
	}

	return "part";
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
	mapValueToSelectedKeys,
	mapSelectedKeysToValue,
	getMap,
	getParent,
	getCheckedStatus,
	getIndeterminateStatus,
	getSelectedOptions,
};