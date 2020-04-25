/**
 * 首字母大写
 */
export default function firstUpperCase(str) {
	str = str.toString();

	return str[0].toUpperCase() + str.slice(1);
};