/**
* 返回限制在 lower 和 upper 之间的值
* @param {Number} number 被限制的值
* @param {Number} lower 下限
* @param {Number} upper 上限
*/
export default function clamp(number, lower, upper) {
  return Math.min.call(null, Math.max.call(null, number, lower), upper);
};