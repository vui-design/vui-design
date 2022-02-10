export default function hasOwnProperty(object, key) {
  key = key.replace(/\[(\w+)\]/g, ".$1");
  key = key.replace(/^\./, "");

  const keys = key.split(".");
  let hasOwnProperty = false;

  for (let i = 0, length = keys.length; i < length; i++) {
    const key = keys[i];

    if (object) {
      hasOwnProperty = Object.prototype.hasOwnProperty.call(object, key);
    }
    else {
      hasOwnProperty = false;
    }

    if (hasOwnProperty) {
      object = object[key];
    }
    else {
      break;
    }
  }

  return hasOwnProperty;
};