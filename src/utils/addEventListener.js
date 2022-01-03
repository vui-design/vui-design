/**
* 用于向指定元素添加事件句柄
* @param {Window|HTMLElement} target 需要添加事件的目标元素
* @param {String} type 事件类型
* @param {Function} listener 事件回调函数
* @param {Object|Boolean} option 选项
*/
export default function addEventListener(target, type, listener, option) {
  if (target.addEventListener) {
    let useCapture = false;

    if (typeof option === "object") {
      useCapture = option.capture || false;
    }
    else if (typeof option === "boolean") {
      useCapture = option;
    }

    target.addEventListener(type, listener, option || false);

    return {
      remove() {
        target.removeEventListener(type, listener, useCapture);
      }
    };
  }
  else if (target.attachEvent) {
    target.attachEvent("on" + type, listener);

    return {
      remove() {
        target.detachEvent("on" + type, listener);
      }
    };
  }
};