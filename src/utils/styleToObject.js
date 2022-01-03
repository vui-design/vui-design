import is from "./is";

/**
* 将字符串格式的行内样式转换为对象格式
* @param {String} style 行内样式 
*/
export default function styleToObject(style) {
  let object = {};

  if (!style || !is.string(style)) {
    return object;
  }

  const array = style.split(";").filter(item => item);

  array.forEach(item => {
    const part = item.split(":").map(string => string.trim());
    let key = part[0];
    let value = part[1];

    key = key.replace(/-(\w)/g, (match, letter) => {
      return letter.toUpperCase();
    });

    object[key] = value;
  });

  return object;
};