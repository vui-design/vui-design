/**
* 将传入的字符串值首字母大写
*/
export default function firstUpperCase(value) {
  value = String(value);

  return value[0].toUpperCase() + value.slice(1);
};