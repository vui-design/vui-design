import getTimestamp from "./getTimestamp";

export default function(fn, wait, options){
  let timeout, context, args, result, previous = 0;

  if (!options) {
    options = {};
  }

  let later = function() {
    previous = options.leading === false ? 0 : getTimestamp();
    timeout = null;
    result = fn.apply(context, args);

    if (!timeout) {
      context = args = null;
    }
  };

  let throttled = function() {
    let current = getTimestamp();

    if (!previous && options.leading === false) {
      previous = current;
    }

    var remaining = wait - (current - previous);

    context = this;
    args = arguments;

    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }

      previous = current;
      result = fn.apply(context, args);

      if (!timeout) {
        context = args = null;
      }
    }
    else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }

    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;
};