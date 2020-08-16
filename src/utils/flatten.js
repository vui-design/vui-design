import is from "./is";

/**
* 扁平化处理嵌套结构的数据，将多维数据转换为一维数组
* @param {Array} list 数据源
* @param {String} property 子数据对应的键值；可选，默认为 children 字段
* @param {Boolean} keep 如果单一数据项包含子数据，展开其子数据之前是否保留父级本身；可选，默认为 false 不保留
* @param {Function} predicate 谓词函数，用于判断是否展开子数据；可选
*/
export default function flatten(list, property = "children", keep = false, predicate) {
    let array = [];

    list.forEach(item => {
        if (item[property]) {
            if (keep) {
                array.push(item);
            }

            if (is.function(predicate) && !predicate(item)) {
                return;
            }

            array.push.apply(array, flatten(item[property], property, keep, predicate));
        }
        else {
            array.push(item);
        }
    });

    return array;
};