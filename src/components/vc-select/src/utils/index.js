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
* @param {String} keyword 关键字
* @param {Object} option 选项
* @param {String} property 查询属性
*/
export const defaultOptionFilter = (keyword, option, property) => {
	if (!keyword) {
		return true;
	}

	const comparator = createRegexer(keyword);

	if (property === "label" || property === "value") {
		return comparator.test(option[property]);
	}
	else if (property === "children") {
		return comparator.test(getTextFromChildren(option.children));
	}
};

/**
* 获取子节点的文本
* @param {Array} children 子节点
*/
export const getTextFromChildren = (children) => {
	let text = "";

	if (!children || !children.length) {
		return text;
	}

	if (is.string(children)) {
		return children;
	}

	children.forEach(element => {
		if (!element) {
			return;
		}

		if (element.text) {
			text += element.text;
		}

		if (element.children && element.children.length) {
			text += getTextFromChildren(element.children);
		}
	});

	return text;
};

/**
* 根据 keyword 关键字筛选 options 选项列表
* @param {String} keyword 关键字
* @param {Array} options 选项列表
* @param {Function} filter 筛选函数
* @param {String} property 查询属性
*/
export const getFilteredOptions = (keyword, options, filter, property) => {
	let array = [];
	let iterator = is.function(filter) ? filter : defaultOptionFilter;

	options.forEach(element => {
		if (element.isOptionGroup) {
			const optgroup = {
				...element,
				children: getFilteredOptions(keyword, element.children, filter, property)
			};

			if (optgroup.children.length) {
				array.push(optgroup);
			}
		}
		else if (element.isOption) {
			if (iterator(keyword, element, property)) {
				const option = {
					...element
				};

				array.push(option);
			}
		}
	});

	return array;
};

/**
* 将 options 选项列表转换为一维数组形式
* @param {Array} options 选项列表
*/
export const getFlattenOptions = (options) => {
	let array = [];

	options.forEach(element => {
		if (element.isOptionGroup) {
			array.push.apply(array, getFlattenOptions(element.children));
		}
		else if (element.isOption) {
			array.push(element);
		}
	});

	return array;
};

/**
* 判断两个选项数组是否相等（包含元素及元素位置）
* @param {Array} a 第一个数组
* @param {Array} b 第二个数组
*/
export const isArrayEqual = (a, b) => {
	let bool = true;

	if (a === b) {
		bool = true;
	}
	else {
		if (a.length !== b.length) {
			bool = false;
		}
		else {
			bool = a.every((element, i) => element === b[i]);
		}
	}

	return bool;
};

/**
* 判断输入的关键字是否是一个已经存在的选项
* @param {String} keyword 关键字
* @param {Array} options 选项列表
*/
export const isExistedOption = (keyword, options) => {
	const bool = options.some(element => {
		if (element.isOptionGroup) {
			return isExistedOption(keyword, element.children);
		}
		else if (element.isOption) {
			return element.label === keyword || element.value === keyword;
		}
	});

	return bool;
};
