import is from "./is";

/**
* 扁平化处理嵌套结构的列表数据
* @param {Array} list 数据列表
* @param {String} property 数据条目的子数据所对应的键值名称，可选，默认为 children 字段
* @param {Boolean} keep 扁平化处理时是否保留父级数据条目，可选，默认为 false 不保留
* @param {Function} predicate 谓词函数，用于判断是否展开子数据；可选
*/
export default function flatten(list, property = "children", keep = false, predicate) {
  if (is.boolean(property)) {
    predicate = key;
    keep = property;
    property = "children";
  }

  let array = [];

  list.forEach(item => {
    let children = item[property];

    if (children) {
      if (keep) {
        array.push(item);
      }

      if (is.function(predicate) && !predicate(item)) {
        return;
      }

      array.push.apply(array, flatten(children, property, keep, predicate));
    }
    else {
      array.push(item);
    }
  });

  return array;
};