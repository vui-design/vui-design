const isBlankspace = function(element) {
	return !(element.tag || (element.text && element.text.trim() !== ""));
};

/**
* 剔除空元素/空节点
* @param {Array} children 元素/节点列表
*/
export default function getElementWithoutBlankspace(children = []) {
	return children.filter(element => !isBlankspace(element));
};