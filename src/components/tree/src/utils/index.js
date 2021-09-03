import clone from "../../../../utils/clone";

/**
* 从组件属性中获取派生数据
* @param {Array} data 节点列表
* @param {Object} parent 节点父级
* @param {Array} path 节点路径
*/
export const getDerivedDataFromProps = (data, parent = null, path = []) => {
	parent = clone(parent);
	path = clone(path);

	if (parent && parent.key) {
		path = path.concat(parent.key);
	}

	return data.map(item => {
		let target = {
			key: item.key,
			icon: item.icon,
			title: item.title,
			disabled: item.disabled,
			parent: parent,
			path: path
		};

		if (item.children) {
			target.children = getDerivedDataFromProps(item.children, item, path);
		}

		return target;
	});
};

/**
* 从组件属性中获取派生值
* @param {Array} value 组件的选中值
* @param {Array} options 组件的选项列表
* @param {Object} keyName 选项中自定义的 value 字段
*/
export const getDerivedCheckedKeysFromProps = (keys, node, checked) => {
	keys = clone(keys);
	node = clone(node);

	let index = keys.indexOf(node.key);

	if (checked) {
		if (index == -1) {
			keys.push(node.key);
		}
	}
	else {
		if (index > -1) {
			keys.splice(index, 1);
		}
	}

	if (node.children && node.children.length) {
		node.children.forEach(child => {
			keys = getDerivedCheckedKeysFromProps(keys, child, checked);
		});
	}

	return keys;
};

