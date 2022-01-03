const objToString = Object.prototype.toString;

/**
* 获取给定的值类型
* @param {*} value
*/
export default function getType(value) {
  return objToString.call(value);
};