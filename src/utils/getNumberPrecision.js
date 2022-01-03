/**
* 获取数值精度
* @param {Number} value 数值
*/
export default function getNumberPrecision(value) {
  if (value == undefined) {
    return 0;
  }

  let precision;

  try {
    precision = value.toString().split(".")[1].length;
  }
  catch(e) {
    precision = 0;
  }

  return precision;
};