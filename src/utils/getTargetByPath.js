export default function getTargetByPath(source, path = "", strict) {
  let target = source;

  path = path.replace(/\[(\w+)\]/g, ".$1");
  path = path.replace(/^\./, "");

  const keys = path.split(".");
  const length = keys.length;
  let i = 0;

  for (; i < length - 1; ++i) {
    if (!target && !strict) {
      break;
    }

    const key = keys[i];

    if (key in target) {
      target = target[key];
    }
    else {
      if (strict) {
        throw new Error("[Vui Design warn][getTargetByPath]: please transfer a valid prop path.");
      }

      break;
    }
  }

  return {
    from: target,
    key: keys[i],
    value: target ? target[keys[i]] : null
  };
};