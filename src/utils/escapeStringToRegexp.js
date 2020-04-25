/**
 * 将字符串转义成正则表达式
 * @param {*} value 
 */
export default function escapeStringToRegexp(value = "") {
	return new RegExp(String(value).replace(/[|\\{}()[\]^$+*?.]/g, "\\$&"), "i");
};