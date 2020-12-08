/**
* 获取触发事件的元素对象
* @returns {Event} event 对象
*/
export default function getElementByEvent(event) {
	const e = event || window.event;

	return e.target || e.srcElement;
};