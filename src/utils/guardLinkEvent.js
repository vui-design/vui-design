/**
* 链接点击事件守卫
* @param {Event} e 事件对象
*/
export default function guardLinkEvent(e) {
  // 使用组合键时不进行跳转
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) {
    return false;
  }

  // e.preventDefault() 被调用时不进行跳转
  if (e.defaultPrevented) {
    return false;
  }

  // 鼠标右键点击时不进行跳转
  if (e.button !== undefined && e.button !== 0) {
    return false;
  }

  // target="_blank" 时不进行跳转
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target = e.currentTarget.getAttribute("target");

    if (/\b_blank\b/i.test(target)) {
      return false;
    }
  }

  if (e.preventDefault) {
    e.preventDefault();
  }

  return true;
};