import clone from "vui-design/utils/clone";
import guid from "vui-design/utils/guid";
import noop from "vui-design/utils/noop";
import is from "vui-design/utils/is";

/**
 * 为 columns 配置填充默认选项
 * @param {Array} columns
 */
const addDefaultsToColumns = (columns, parent) => {
    return columns.map((column) => {
        // 填充 key 属性
        if ("key" in column) {
            column.key = column.key;
        }
        else if ("dataIndex" in column) {
            column.key = column.dataIndex;
        }
        else {
            column.key = guid();
        }

        // 如果具有父级，则 fixed 属性强制继承父级
        if (parent) {
            column.fixed = parent.fixed;
        }

        // 设置列的默认水平对齐方式
        if (!column.align) {
            column.align = "left";
        }

        // 排序列
        if (column.sorter) {
            if (!is.plainObject(column.sorter)) {
                column.sorter = {};
            }

            if (!("order" in column.sorter)) {
                column.sorter.order = "normal";
            }
        }

        // 过滤列
        if (column.filter) {
            if (!is.plainObject(column.filter)) {
                column.filter = {};
            }

            if (!("options" in column.filter)) {
                column.filter.options = [];
            }

            if (!("multiple" in column.filter)) {
                column.filter.multiple = true;
            }

            if (!("value" in column.filter)) {
                column.filter.value = column.filter.multiple ? [] : undefined;
            }
        }

        // 子列头
        if (column.children) {
            column.children = addDefaultsToColumns(column.children, column);
        }

        // 返回填充属性后的列数据
        return column;
    });
};

/**
 * 为 data 配置填充默认选项
 * @param {Array} data
 */
const addDefaultsToData = (data, getRowKey) => {
    return data.map((row) => {
        // 返回填充属性后的行数据
        return row;
    });
};

/**
 * 将 columns 配置转换为一维数组形式
 * @param {Array} columns
 * @param {Boolean} reserve
 */
export const getFlattenColumns = (columns, reserve = false) => {
    let array = [];

    columns.forEach((column) => {
        if (column.children) {
            if (reserve) {
                array.push(column);
            }

            array.push.apply(array, getFlattenColumns(column.children, reserve));
        }
        else {
            array.push(column);
        }
    });

    return array;
};

/**
 * 将 columns 配置解析为组件内部状态
 * @param {Array} columns
 */
export const mapColumnsToState = (columns) => {
    columns = clone(columns);

    let left = [];
    let middle = [];
    let right = [];

    columns.forEach(column => {
        if (column.fixed === "left") {
            left.push(column);
        }
        else if (!column.fixed) {
            middle.push(column);
        }
        else if (column.fixed === "right") {
            right.push(column);
        }
    });

    return addDefaultsToColumns(left.concat(middle).concat(right));
};

/**
 * 将 data 配置解析为组件内部状态
 * @param {Array} data
 */
export const mapDataToState = (data) => {
    data = clone(data);

    return addDefaultsToData(data);
};
