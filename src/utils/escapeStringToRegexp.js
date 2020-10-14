/**
* 将字符串转义成正则表达式
* @param {String} value 字符串值
*/
export default value => new RegExp(String(value).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "i");