import Vue from "vue";

var funProto = Function.prototype;
var arrProto = Array.prototype;
var objProto = Object.prototype;

var nativeIsArray = Array.isArray;
var nativeFind = arrProto.find;
var nativeFindIndex = arrProto.findIndex;

var getPrototypeOf = Object.getPrototypeOf;

var objToString = objProto.toString;
var hasOwnProperty = objProto.hasOwnProperty;
var funToString = funProto.toString;

// 空操作函数，可用于默认的回调函数
var noop = function() {

};

// 检查给定的值是否是 null
var isNull = function(value) {
  return value === null;
};

// 检查给定的值是否是 undefined
var isUndefined = function(value) {
  return value === void 0;
};

// 检查给定的值是否是数值
var isNumber = function(value) {
  return objToString.call(value) === "[object Number]";
};

// 检查给定的值是否是字符串
var isString = function(value) {
  return objToString.call(value) === "[object String]";
};

// 检查给定的值是否是布尔值
var isBoolean = function(value) {
  return value === true || value === false || objToString.call(value) === "[object Boolean]";
};

// 检查给定的值是否是函数
var isFunction = function(value) {
  return objToString.call(value) === "[object Function]" || typeof value === "function";
};

// 检查给定的值是否是数组
var isArray = nativeIsArray || function(value) {
  return objToString.call(value) === "[object Array]";
};

// 检查给定的值是否是对象
var isObject = function(value) {
  return !!value && typeof value === "object";
};

// 检查给定的值是否是纯对象
var isPlainObject = function(value) {
  if (!value || objToString.call(value) !== "[object Object]") {
    return false;
  }

  var prototype = getPrototypeOf(value);

  if (prototype === null) {
    return true;
  }

  var constructor = hasOwnProperty.call(prototype, "constructor") && prototype.constructor;

  return typeof constructor === "function" && funToString.call(constructor) === funToString.call(Object);
};

// 检查给定的值是否是 dom 元素
var isElement = function(value) {
  return !!(value && value.nodeType === 1);
};

// 扩展目标对象
var assign = function() {
  var src;
  var copyIsArray;
  var copy;
  var name;
  var options;
  var clone;
  var target = arguments[0] || {};
  var i = 1;
  var length = arguments.length;
  var deep = false;

  if (isBoolean(target)) {
    deep = target;

    target = arguments[i] || {};
    i++;
  }

  if (typeof target !== "object" && !isFunction(target)) {
    target = {};
  }

  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    if ((options = arguments[i] ) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];

        if (target === copy) {
          continue;
        }

        if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && isArray(src) ? src : [];
          }
          else {
            clone = src && isPlainObject(src) ? src : {};
          }

          target[name] = assign(deep, clone, copy);
        }
        else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }

  return target;
};










// 为给定元素设置属性
var setAttributes = function(element, attributes) {
  Object.keys(attributes).forEach(function(prop) {
    var value = attributes[prop];

    if (value === false) {
      element.removeAttribute(prop);
    }
    else {
      element.setAttribute(prop, value);
    }
  });
};

// 为给定元素设置样式
var setStyles = function(element, styles) {
  Object.keys(styles).forEach(function(prop) {
    var unit = "";

    // 如果如下属性的值为数字，需要添加单位
    if (["width", "height", "top", "bottom", "left", "right"].indexOf(prop) !== -1 && isNumber(styles[prop])) {
      unit = "px";
    }

    element.style[prop] = styles[prop] + unit;
  });
};

// 返回给定元素的计算样式
var getComputedStyle = function(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }

  var style = window.getComputedStyle(element, null);

  return property ? style[property] : style;
};

// 获取带有浏览器前缀的属性名
var getSupportedPropertyName = function(property) {
  var prefixes = ["", "webkit", "moz", "ms", "o"];

  for (var i = 0, length = prefixes.length; i < length; i++) {
    var prefix = prefixes[i];

    if (prefix) {
      property = prefix + property.charAt(0).toUpperCase() + property.slice(1);
    }

    if (document.body.style[property] !== undefined) {
      return property;
    }
  }

  return null;
};

// 获取给定元素的边界
var getBoundingClientRect = function(element) {
  var rect = element.getBoundingClientRect();
  var isIE = navigator.userAgent.indexOf("MSIE") !== -1;
  var rectTop = isIE && element.tagName === "HTML" ? -element.scrollTop : rect.top;

  return {
    top: rectTop,
    bottom: rect.bottom,
    left: rect.left,
    right: rect.right,
    width: rect.right - rect.left,
    height: rect.bottom - rectTop
  };
};

// 返回给定元素的外围尺寸（offset 大小 + 外边距）
var getOuterSize = function(element) {
  var style = getComputedStyle(element);

  return {
    width: element.offsetWidth + parseFloat(style.marginLeft) + parseFloat(style.marginRight),
    height: element.offsetHeight + parseFloat(style.marginTop) + parseFloat(style.marginBottom)
  };
};

// 返回给定元素的 offsetParent
var getOffsetParent = function(element) {
  var offsetParent = element.offsetParent;

  return !offsetParent || offsetParent === document.body ? document.documentElement : offsetParent;
};

// 返回给定元素的 scrollParent
var getScrollParent = function(element) {
  var parent = element.parentNode;

  if (!parent) {
    return element;
  }

  if (parent === document) {
    // Firefox 会将 scrollTop 的判断放置在 documentElement 而非 body 上
    // 我们将判断二者谁大于 0 来返回正确的元素
    if (document.body.scrollTop || document.body.scrollLeft) {
      return document.body;
    }
    else {
      return document.documentElement;
    }
  }

  // Firefox 要求我们也要检查 overflow-x 以及 overflow-y
  if (["scroll", "auto"].indexOf(getComputedStyle(parent, "overflow")) !== -1 || ["scroll", "auto"].indexOf(getComputedStyle(parent, 'overflow-x')) !== -1 || ["scroll", "auto"].indexOf(getComputedStyle(parent, 'overflow-y')) !== -1) {
    // 如果检测到的 scrollParent 是 body，我们将对其父元素做一次额外的检测
    // 这样在 Chrome 系的浏览器中会得到 body，其他情况下会得到 documentElement
    return parent;
  }

  return getScrollParent(parent);
};

// 返回 reference 元素的 offsets
var getReferenceOffsets = function(reference, target, fixed) {
  var referenceRect = getBoundingClientRect(reference);
  var offsetParentRect = getBoundingClientRect(getOffsetParent(target));

  if (fixed) {
    var scrollParent = getScrollParent(offsetParent);

    offsetParentRect.top += scrollParent.scrollTop;
    offsetParentRect.bottom += scrollParent.scrollTop;
    offsetParentRect.left += scrollParent.scrollLeft;
    offsetParentRect.right += scrollParent.scrollLeft;
  }

  return {
    top: referenceRect.top - offsetParentRect.top,
    bottom: (referenceRect.top - offsetParentRect.top) + referenceRect.height,
    left: referenceRect.left - offsetParentRect.left,
    right: (referenceRect.left - offsetParentRect.left) + referenceRect.width,
    width: referenceRect.width,
    height: referenceRect.height
  };
};

// 返回 target 元素的 offsets
var getTargetOffsets = function(target, referenceOffsets, placement) {
  placement = placement.split("-")[0];

  var targetRect = getOuterSize(target);
  var targetOffsets = {
    width: targetRect.width,
    height: targetRect.height
  };

  if (["left", "right"].indexOf(placement) !== -1) {
    targetOffsets.top = referenceOffsets.top + referenceOffsets.height / 2 - targetRect.height / 2;

    if (placement === "left") {
      targetOffsets.left = referenceOffsets.left - targetRect.width;
    }
    else {
      targetOffsets.left = referenceOffsets.right;
    }
  }
  else if (["top", "bottom"].indexOf(placement) !== -1) {
    targetOffsets.left = referenceOffsets.left + referenceOffsets.width / 2 - targetRect.width / 2;

    if (placement === "top") {
      targetOffsets.top = referenceOffsets.top - targetRect.height;
    }
    else {
      targetOffsets.top = referenceOffsets.bottom;
    }
  }

  return targetOffsets;
};

// 返回边界信息
var getBoundaries = function(data, boundariesElement, padding) {
  var boundaries = {};
  var width;
  var height;

  if (boundariesElement === "window") {
    var html = document.documentElement;
    var body = document.body;

    width = Math.max(html.clientWidth, html.scrollWidth, html.offsetWidth, body.scrollWidth, body.offsetWidth);
    height = Math.max(html.clientHeight, html.scrollHeight, html.offsetHeight, body.scrollHeight, body.offsetHeight);

    boundaries = {
      top: 0,
      bottom: height,
      left: 0,
      right: width
    };
  }
  else if (boundariesElement === "viewport") {
    var offsetParent = getOffsetParent(data.instance.target);
    var scrollParent = getScrollParent(data.instance.target);
    var offsetParentRect = getOffsetRect(offsetParent);

    var getScrollTopValue = function(element) {
      return element == document.body ? Math.max(document.documentElement.scrollTop, document.body.scrollTop) : element.scrollTop;
    };
    var getScrollLeftValue = function(element) {
      return element == document.body ? Math.max(document.documentElement.scrollLeft, document.body.scrollLeft) : element.scrollLeft;
    };

    var scrollTop = data.offsets.target.position === "fixed" ? 0 : getScrollTopValue(scrollParent);
    var scrollLeft = data.offsets.target.position === "fixed" ? 0 : getScrollLeftValue(scrollParent);

    boundaries = {
      top: 0 - (offsetParentRect.top - scrollTop),
      bottom: document.documentElement.clientHeight - (offsetParentRect.top - scrollTop),
      left: 0 - (offsetParentRect.left - scrollLeft),
      right: document.documentElement.clientWidth - (offsetParentRect.left - scrollLeft)
    };
  }
  else {
    if (getOffsetParent(data.instance.target) === boundariesElement) {
      boundaries = {
        top: 0,
        bottom: boundariesElement.clientHeight,
        left: 0,
        right: boundariesElement.clientWidth
      };
    }
    else {
      boundaries = getOffsetRect(boundariesElement);
    }
  }

  var bool = isPlainObject(padding);

  boundaries.top += bool ? (padding.top || 0) : padding; 
  boundaries.bottom -= bool ? (padding.bottom || 0) : padding; 
  boundaries.left += bool ? (padding.left || 0) : padding; 
  boundaries.right -= bool ? (padding.right || 0) : padding; 

  return boundaries;
};

// 
var getOffsetRect = function(element) {
  var elementRect = {
    width: element.offsetWidth,
    height: element.offsetHeight,
    top: element.offsetTop,
    left: element.offsetLeft,
  };

  elementRect.bottom = elementRect.top + elementRect.height;
  elementRect.right = elementRect.left + elementRect.width;

  return elementRect;
};

// 
var getTargetClientRect = function(targetOffsets) {
  var clientRect = assign({}, targetOffsets);

  clientRect.right = clientRect.left + clientRect.width;
  clientRect.bottom = clientRect.top + clientRect.height;

  return clientRect;
};

// 返回给定位置的相反位置
var getOppositePlacement = function(placement) {
  var hash = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left"
  };

  return placement.replace(/top|bottom|left|right/g, function(matched){
    return hash[matched];
  });
};

// 根据给定的检索函数，在修饰符列表中查找指定的修饰符
var findModifier = function(modifiers, check) {
  if (nativeFind) {
    return modifiers.find(check);
  }

  return modifiers.filter(check)[0];
};

// 给定一个修饰符的名称，查找该修饰符在修饰符列表中的索引
var findModifierIndex = function(modifiers, prop, value) {
  if (nativeFindIndex) {
    return modifiers.findIndex(function(current) {
      return current[prop] === value;
    });
  }

  var match = findModifier(modifiers, function(current) {
    return current[prop] === value;
  });

  return modifiers.indexOf(match);
};

// 检查是否启用了给定名称的修饰符
var isModifierEnabled = function(modifiers, modifierName) {
  return modifiers.some(function(current) {
    return current.name === modifierName && current.enabled;
  });
};

// 用于判断给定的修饰符是否依赖另外一个修饰符
// 它检查所需的修饰符是否列出并启用
var isModifierRequired = function(modifiers, requestingName, requestedName) {
  var requesting = findModifier(modifiers, function(current) {
    return current.name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function(current) {
    return current.name === requestedName && current.enabled && current.order < requesting.order;
  });

  if (!isRequired) {
    console.warn("Popup warning: \"" + requestedName + "\" modifier is required by \"" + requestingName + "\" modifier in order to work, be sure to include it before \"" + requestingName + "\"!");
  }

  return isRequired;
};

// 循环修饰符列表并按顺序运行，它们将依次编辑 data 对象
var runModifiers = function(data, modifiers, ends) {
  var modifiersToRun = modifiers;

  if (ends !== undefined) {
    modifiersToRun = modifiers.slice(0, findModifierIndex(modifiers, "name", ends));
  }

  modifiersToRun.forEach(function(modifierOptions) {
    var fn = modifierOptions.fn;

    if (modifierOptions.enabled && isFunction(fn)) {
      data = fn(data, modifierOptions);
    }
  });

  return data;
};























































/****************************************************************************************************
 * Popup 修饰器列表
 * align, offset, preventOverflow, keepTogether, arrow, flip, applyStyle
 */
var modifiers = {
  // 用于将 target 元素与其参考元素两端对齐
  align: {
    order: 100,
    enabled: true,
    fn: function(data, modifierOptions) {
      var placement = data.placement.split("-")[0];
      var alignment = data.placement.split("-")[1];

      if (alignment) {
        var reference = data.offsets.reference;
        var target = data.offsets.target;

        var axis = ["top", "bottom"].indexOf(placement) !== -1 ? "x" : "y";
        var offsets = {
          x: {
            start: {
              left: reference.left
            },
            end: {
              left: reference.left + reference.width - target.width
            }
          },
          y: {
            start: {
              top: reference.top
            },
            end: {
              top: reference.top + reference.height - target.height 
            }
          }
        };

        data.offsets.target = assign({}, target, offsets[axis][alignment]);
      }

      return data;
    }
  },
  // 为 target 元素添加偏移量，用于更精确的定位
  offset: {
    order: 200,
    enabled: true,
    offset: [0, 0],
    fn: function(data, modifierOptions) {
      var offset = modifierOptions.offset;
      var target  = data.offsets.target;

      if (data.placement.indexOf("top") > -1) {
        target.top -= offset[1];
        target.left += offset[0];
      }
      else if (data.placement.indexOf("bottom") > -1) {
        target.top += offset[1];
        target.left += offset[0];
      }
      else if (data.placement.indexOf("left") > -1) {
        target.top += offset[1];
        target.left -= offset[0];
      }
      else if (data.placement.indexOf("right") > -1) {
        target.top += offset[1];
        target.left += offset[0];
      }

      return data;
    }
  },
  // 用于防止 target 元素溢出边界元素
  preventOverflow: {
    order: 300,
    enabled: true,
    boundariesElement: "viewport",
    padding: 0,
    priority: ["top", "bottom", "left", "right"],
    fn: function(data, modifierOptions) {
      var target = data.offsets.target;
      var boundaries = getBoundaries(data, modifierOptions.boundariesElement, modifierOptions.padding);

      var priority = modifierOptions.priority;
      var check = {
        top: function() {
          var top = target.top;

          if (target.top < boundaries.top) {
            top = Math.max(target.top, boundaries.top);
          }

          return {
            top: top
          };
        },
        bottom: function() {
          var top = target.top;

          if ((target.top + target.height) > boundaries.bottom) {
            top = Math.min(target.top, boundaries.bottom - target.height);
          }

          return {
            top: top
          };
        },
        left: function() {
          var left = target.left;

          if (target.left < boundaries.left) {
            left = Math.max(target.left, boundaries.left);
          }

          return {
            left: left
          };
        },
        right: function() {
          var left = target.left;

          if ((target.left + target.width) > boundaries.right) {
            left = Math.min(target.left, boundaries.right - target.width);
          }

          return {
            left: left
          };
        }
      };

      priority.forEach(function(side) {
        target = assign({}, target, check[side]());
      });

      data.offsets.target = target;
      data.boundaries = boundaries;

      return data;
    }
  },
  // 用于确保 target 元素总是贴近它的参考元素
  keepTogether: {
    order: 400,
    enabled: true,
    fn: function(data, modifierOptions) {
      var reference = data.offsets.reference;
      var target = data.offsets.target;

      if ((target.top + target.height) < reference.top) {
        target.top = reference.top - target.height;
      }

      if (target.top > reference.bottom) {
        target.top = reference.bottom;
      }

      if ((target.left + target.width) < reference.left) {
        target.left = reference.left - target.width;
      }

      if (target.left > reference.right) {
        target.left = reference.right;
      }

      return data;
    }
  },
  // 用于移动箭头，使其始终位于 target 元素和参考元素之间
  arrow: {
    order: 500,
    enabled: true,
    element: "[role=\"arrow\"]",
    fn: function(data, modifierOptions) {
      // 该修饰符需要依赖 keepTogether 修饰符才能工作
      // 请确保在该修饰符之前已经引入了 keepTogether 修饰符
      if (!isModifierRequired(data.instance.modifiers, "arrow", "keepTogether")) {
        return data;
      }

      var arrowElement = modifierOptions.element;

      if (isString(arrowElement)) {
        arrowElement = data.instance.target.querySelector(arrowElement);

        if (!arrowElement) {
          return data;
        }
      } else {
        if (!data.instance.target.contains(arrowElement)) {
          console.warn("Popup warning: \"arrow.element\" must be child of \"target\" element.");
          return data;
        }
      }

      var placement = data.placement.split("-")[0];

      var reference = data.offsets.reference;
      var target = data.offsets.target;

      var arrowSize = getOuterSize(arrowElement);
      var arrowStyle = {};

      // 上 or 下
      if (["top", "bottom"].indexOf(placement) !== -1) {
        // 防止 target 向左偏移时，arrow 脱离 reference
        if ((target.left + target.width) < (reference.left + arrowSize.width)) {
          target.left = reference.left + arrowSize.width - target.width;
        }

        // 防止 target 向右偏移时，arrow 脱离 reference
        if (target.left > (reference.right - arrowSize.width)) {
          target.left = reference.right - arrowSize.width;
        }

        var value = reference.left + ((reference.width / 2) - (arrowSize.width / 2)) - target.left;

        value = Math.min(value, target.width - arrowSize.width);
        value = Math.max(value, 0);

        arrowStyle.top = "";
        arrowStyle.left = value;
      }
      // 左 or 右
      else if (["left", "right"].indexOf(placement) !== -1) {
        // 防止 target 向上偏移时，arrow 脱离 reference
        if ((target.top + target.height) < (reference.top + arrowSize.height)) {
          target.top = reference.top + arrowSize.height - target.height;
        }

        // 防止 targte 向下偏移时，arrow 脱离 reference
        if (target.top > (reference.bottom - arrowSize.height)) {
          target.top = reference.bottom - arrowSize.height;
        }

        var value = reference.top + ((reference.height / 2) - (arrowSize.height / 2)) - target.top;

        value = Math.min(value, target.height - arrowSize.height);
        value = Math.max(value, 0);

        arrowStyle.top = value;
        arrowStyle.left = "";
      }

      data.arrowElement = arrowElement;
      data.offsets.arrow = arrowStyle;

      return data;
    }
  },
  // 如果 target 元素覆盖了它的参考元素，则通过该修饰符让它翻转
  // 需要在 preventOverflow 修饰符后运行
  // 注：每当该修饰符要翻转 target 元素时，都会将之前的修饰符重新执行一遍
  flip: {
    order: 600,
    enabled: true,
    behavior: "flip",
    fn: function(data, modifierOptions) {
      // 该修饰符需要依赖 preventOverflow 修饰符才能工作
      // 请确保在该修饰符之前已经引入了 preventOverflow 修饰符
      if (!isModifierRequired(data.instance.modifiers, "flip", "preventOverflow")) {
        return data;
      }

      // 避免在四周均没有足够空间用于翻转时，flip 会一直循环执行的问题
      if (data.flipped && data.placement === data.originalPlacement) {
        return data;
      }

      var placement = data.placement.split("-")[0];
      var alignment = data.placement.split("-")[1];

      var oppositePlacement = getOppositePlacement(placement);

      var flipOrder = [];

      if(modifierOptions.behavior === "flip") {
        flipOrder = [
          placement,
          oppositePlacement
        ];
      }
      else {
        flipOrder = modifierOptions.behavior;
      }

      flipOrder.forEach(function(step, index) {
        if (placement !== step || flipOrder.length === index + 1) {
          return;
        }

        placement = data.placement.split("-")[0];
        oppositePlacement = getOppositePlacement(placement);

        var targetOffsets = getTargetClientRect(data.offsets.target);
        var a = ["bottom", "right"].indexOf(placement) !== -1;

        if (a && data.offsets.reference[placement] > targetOffsets[oppositePlacement] || !a && data.offsets.reference[placement] < targetOffsets[oppositePlacement]) {
          data.flipped = true;
          data.placement = flipOrder[index + 1] + (alignment ? "-" + alignment : "");
          data.offsets.target = assign({}, data.offsets.target, getTargetOffsets(data.instance.target, data.offsets.reference, data.placement));

          data = runModifiers(data, data.instance.modifiers, "flip");
        }
      });

      return data;
    }
  },
  // 
  computeStyle: {
    order: 700,
    enabled: true,
    gpuAcceleration: false,
    fn: function computeStyle(data, modifierOptions) {
      var target = data.offsets.target;

      var attributes = {
        "data-placement": data.placement
      };
      var styles = {
        "position": target.position
      };

      var top = Math.round(target.top);
      var left = Math.round(target.left);
      var transform = getSupportedPropertyName("transform");

      if (modifierOptions.gpuAcceleration && transform) {
        styles.top = 0;
        styles.left = 0;
        styles[transform] = "translate3d(" + left + "px, " + top + "px, 0)";
      }
      else {
        styles.top = top;
        styles.left = left;
      }

      data.attributes = assign({}, attributes, data.attributes);
      data.styles = assign({}, styles, data.styles);
      data.arrowStyles = assign({}, data.offsets.arrow, data.arrowStyles);

      return data;
    }
  },
  // 为 target 元素应用计算后的样式
  applyStyle: {
    order: 800,
    enabled: true,
    onLoad: function(target, reference, options, modifierOptions, state) {
      // 应用 data-placement 属性
      setAttributes(target, {
        "data-placement": options.placement
      });

      // 确保在计算之前已经给 target 元素应用了 position 属性，否则可能导致计算结果出现偏差
      setStyles(target, {
        "position": options.fixed ? "fixed" : "absolute"
      });
    },
    fn: function(data) {
      setAttributes(data.instance.target, data.attributes);

      setStyles(data.instance.target, data.styles);

      if (data.arrowElement && Object.keys(data.arrowStyles).length) {
        setStyles(data.arrowElement, data.arrowStyles);
      }
    
      return data;
    }
  }
};





/****************************************************************************************************
 * Popup 选项
 */
var defaults = {
  // 强制 target 元素使用绝对定位
  fixed: false,
  // 设置 target 元素弹出位置
  placement: "bottom",
  // 
  removeTargetOnDestroy: false,
  // 修饰器列表
  modifiers: modifiers,
  // 创建后的回调函数
  onCreate: noop,
  // 销毁后的回调函数
  onUpdate: noop
};





/****************************************************************************************************
 * Popup 构造函数
 */
function Popup(reference, target, options) {
  var me = this;

  // 深度合并选项对象
  me.options = assign(true, {}, defaults, options);

  // 状态对象
  me.state = {
    isCreated: false,
    isDestroyed: false
  };

  // 缓存 reference 元素和 target 元素
  me.reference = reference;
  me.target = isPlainObject(target) ? this.createTarget(target) : target;

  // 重构修饰符列表（对象转数组）
  me.modifiers = Object.keys(me.options.modifiers).map(function(name) {
    var modifierOptions = {
      name: name
    };

    return assign(true, modifierOptions, me.options.modifiers[name]);
  })
  .sort(function(a, b) {
    return a.order - b.order;
  });

  // 绑定 update 方法
  this.update = this.update.bind(this);

  // 修饰符在 Popup.js 初始化时具有执行任意代码的能力
  // 这些代码按照其修饰符的顺序执行，它们可以在它们的选项配置中添加新属性
  // 注意：不要向 options.modifiers.name 添加选项，而是添加到 modifierOptions
  me.modifiers.forEach(function(modifierOptions) {
    if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
      modifierOptions.onLoad(me.target, me.reference, me.options, modifierOptions, me.state);
    }
  });

  // 触发第一次 update 让 target 元素定位到正确的位置
  me.update();

  // 添加相关事件监听，它们会在一定情况下处理位置更新
  me.addEventListenners();
}

// 通过解析配置对象创建 target 元素
Popup.prototype.createTarget = function(settings) {
  // 默认配置
  var defaultSettings = {
    tagName: "div",
    classNames: [],
    attributes: {},
    arrowTagName: "div",
    arrowClassNames: [],
    arrowAttributes: {},
    parent: document.body,
    contentType: "text",
    content: ""
  };

  // 合并配置
  settings = assign({}, defaultSettings, settings);

  // 创建 target 元素
  var target = document.createElement(settings.tagName);

  // 添加相关类名
  addClassNames(target, settings.classNames);
  // 设置相关属性
  setAttributes(target, settings.attributes);

  // 如果 content 是 text 文本，则使用 innerText 插入到 target 内部
  if (settings.contentType === "text") {
    target.innerText = settings.content;
  }
  // 如果 content 是 html 字符，则使用 innerHTML 插入到 target 内部
  else if (settings.contentType === "html") {
    target.innerHTML = settings.content;
  }
  // 如果 content 是 node 节点，则使用 appendChild 插入到 target 内部
  else if (settings.contentType === "node") {
    target.appendChild(settings.content);
  }

  // 如果配置中含有箭头标签名，则添加箭头
  if (settings.arrowTagName) {
    // 创建 arrow 元素
    var arrow = document.createElement(settings.arrowTagName);

    // 添加相关类名
    addClassNames(arrow, settings.arrowClassNames);
    // 添加相关属性
    setAttributes(arrow, settings.arrowAttributes);

    // 将 arrow 元素插入到 target 内部
    target.appendChild(arrow);
  }

  // 将 target 元素插入到 parent 内部
  if (isElement(settings.parent)) {
    settings.parent.appendChild(target);
  }
  // 如果提供的 parent 不是有效的 dom 元素，则抛出错误
  else {
    throw "[Popup.js] the given \"parent\" must be a DOM element.";
  }

  // 返回创建的 target 元素
  return target;
};

// 销毁 target
Popup.prototype.destroy = function() {
  this.state.isDestroyed = true;

  if (isModifierEnabled(this.modifiers, "applyStyle")) {
    this.target.removeAttribute("data-placement");
    this.target.style.position = "";
    this.target.style.top = "";
    this.target.style.left = "";
    this.target.style[getSupportedPropertyName("transform")] = "";
  }

  this.removeEventListeners();

  if (this.options.removeTargetOnDestroy) {
    this.target.parentNode.removeChild(this.target);
  }

  return this;
};

// 更新 target 位置，计算新的偏移值并应用新的样式
Popup.prototype.update = function() {
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    flipped: false,
    offsets: {},
    attributes: {},
    styles: {},
    arrowStyles: {}
  };

  // 在 data 对象中存储位置信息，修饰器可以在需要的时候编辑该信息
  // 使用 originalPlacement 存储原始位置信息
  data.placement = this.options.placement;
  data.originalPlacement = this.options.placement;

  // 计算 target 和 reference 元素的偏移值，将结果存储到 data.offsets 中
  data.offsets.reference = getReferenceOffsets(this.reference, this.target, this.options.fixed);
  data.offsets.target = getTargetOffsets(this.target, data.offsets.reference, data.placement);

  data.offsets.target.position = this.options.fixed ? "fixed" : "absolute";

  // 执行相应的修饰器
  data = runModifiers(data, this.modifiers);

  // 第一次 update 将调用 onCreate，后续 update 将调用 onUpdate
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  }
  else {
    this.options.onUpdate(data);
  }
};

// 
Popup.prototype.addEventListenners = function() {
  window.addEventListener("resize", this.update);

  var preventOverflowModifier = findModifier(this.modifiers, function(current) {
    return current.name === "preventOverflow";
  });

  if (preventOverflowModifier.boundariesElement !== "window") {
    var scrollTarget = getScrollParent(this.reference);

    // here it could be both `body` or `documentElement` thanks to Firefox, we then check both
    if (scrollTarget === document.body || scrollTarget === document.documentElement) {
      scrollTarget = window;
    }

    this.state.scrollTarget = scrollTarget;
    this.state.scrollTarget.addEventListener("scroll", this.update);
  }
};

// 
Popup.prototype.removeEventListeners = function() {
  window.removeEventListener("resize", this.update);

  var preventOverflowModifier = findModifier(this.modifiers, function(current) {
    return current.name === "preventOverflow";
  });

  if (preventOverflowModifier.boundariesElement !== "window" && this.state.scrollTarget) {
    this.state.scrollTarget.removeEventListener("scroll", this.update);
    this.state.scrollTarget = null;
  }

  this.state.update = null;
};

















/****************************************************/
let zIndex = (Vue.prototype.$vui || {}).zIndex || 2000;

Object.defineProperty(Popup, "zIndex", {
  configurable: true,
  get() {
    return zIndex;
  },
  set(value) {
    zIndex = value;
  }
});

Popup.nextZIndex = function() {
  return Popup.zIndex++;
};
























// 
export default Popup;