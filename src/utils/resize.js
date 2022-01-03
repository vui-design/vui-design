export const addResizeListener = function(element, listener, enforce) {
  // 
  if (!element.resizable) {
    // 设置 element 的 position 属性为 relative
    if (getComputedStyle(element).position === "static") {
      element.style.position = "relative";
    }

    // 插入 object 元素
    var object = document.createElement("object");

    object.type = "text/html";
    object.setAttribute("style", "position: absolute; top: 0; left: 0; z-index: -1; display: block; width: 100%; height: 100%; overflow: hidden; opacity: 0; pointer-events: none;");
    object.onload = function(e) {
      this.contentDocument.defaultView.addEventListener("resize", element.resizable.handler);
    };

    element.appendChild(object);

    // 
    element.resizable = {
      listeners: [],
      trigger: object,
      handler: function(e) {
        var listeners = element.resizable.listeners;
        var i = 0;
        var length = listeners.length;

        for (; i < length; i++) {
          var listener = listeners[i];

          listener.call(null, e);
        }
      }
    };
  }

  // 
  element.resizable.listeners.push(listener);

  // 
  if (enforce) {
    element.resizable.handler();
  }
};

export const removeResizeListener = function(element, listener) {
  if (!element.resizable) {
    return;
  }

  var listeners = element.resizable.listeners;
  var i = 0;
  var length = listeners.length;

  for (; i < length; i++) {
    if (listeners[i] === listener) {
      listeners.splice(i, 1);
      break;
    }
  }

  if (listeners.length === 0) {
    var trigger = element.resizable.trigger;

    if (trigger) {
      trigger.contentDocument.defaultView.removeEventListener("resize", element.resizable.handler);
      element.removeChild(trigger);
    }

    delete element.resizable;
  }
};