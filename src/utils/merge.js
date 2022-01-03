import { isBoolean, isFunction, isArray, isObject, isPlainObject } from "./is";

const merge = function() {
  let deep = false;
  let target = arguments[0] || {};
  let i = 1;
  let length = arguments.length;
  let options, name, src, copy, copyIsArray, clone;

  if (isBoolean(target)) {
    deep = target;
    target = arguments[i] || {};
    i++;
  }

  if (!isObject(target) && !isFunction(target)) {
    target = {};
  }

	for (; i < length; i++) {
		if ((options = arguments[i]) != null) {
			for (name in options) {
				copy = options[name];

				if (name === "__proto__" || target === copy) {
					continue;
				}

				if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
					src = target[name];

					if (copyIsArray && !isArray(src)) {
						clone = [];
          }
          else if (!copyIsArray && !isPlainObject(src)) {
						clone = {};
          }
          else {
						clone = src;
          }

					copyIsArray = false;

					target[name] = merge(deep, clone, copy);
        }
        else if (copy !== undefined) {
					target[name] = copy;
				}
			}
		}
	}

	return target;
};

export default merge;