import clone from "vui-design/utils/clone";

/**
* 从组件属性中获取派生值
* @param {Array} value 组件的选中值
* @param {Array} options 组件的选项列表
* @param {Object} keyName 选项中自定义的 value 字段
*/
export const getDerivedValueFromProps = props => {
	let result = [];
	let array = clone(props.value);

	if (!array.length) {
		return result;
	}

	const value = array.shift();
	const target = props.options.find(option => option[props.keyName] === value);

	if (target) {
		result = result.concat(clone(target));

		if (target.children) {
			result = result.concat(getDerivedValueFromProps({
				value: array,
				options: target.children,
				keyName: props.keyName
			}));
		}
	}

	return result;
};

/**
* 根据所选值获取菜单组
* @param {Array} value 组件的选中值
* @param {Array} options 组件的选项列表
* @param {Object} keyName 选项中自定义的 value 字段
*/
export const getMenusByValue = props => {
	let result = [];
	let array = clone(props.value);

	if (!array.length) {
		if (props.options) {
			result.push(props.options);
		}

		return result;
	}

	result.push(props.options);

	const value = array.shift();
	const target = props.options.find(option => option[props.keyName] === value);

	if (target && target.children) {
		let next = getMenusByValue({
			value: array,
			options: target.children,
			keyName: props.keyName
		});

		result = result.concat(next);
	}

	return result;
};
