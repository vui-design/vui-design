import restArgs from "./restArgs";
import delay from "./delay";

export default function(fn, wait, immediate) {
  let timeout, result;

  let later = function(context, args) {
    timeout = null;

    if (args) {
      result = fn.apply(context, args);
    }
  };

  let debounced = restArgs(function(args) {
    if (timeout) {
      clearTimeout(timeout);
    }

    if (immediate) {
      let callNow = !timeout;

      timeout = setTimeout(later, wait);

      if (callNow) {
        result = fn.apply(this, args);
      }
    } else {
      timeout = delay(later, wait, this, args);
    }

    return result;
  });

  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = null;
    return fn;
  };

  return debounced;
};