import clone from "vui-design/utils/clone";
import guid from "vui-design/utils/guid";
import noop from "vui-design/utils/noop";
import is from "vui-design/utils/is";

/**
 * 为 columns 配置填充默认选项
 * @param {Array} columns 列数据
 */
const addDefaultPropsToColumns = (columns, parent) => {
    return columns.map(column => {
        // 填充 key 属性
        if (!("key" in column)) {
            column.key = "dataIndex" in column ? column.dataIndex : guid();
        }

        // 如果具有父级，则 fixed 属性强制继承父级
        if (parent) {
            column.fixed = parent.fixed;
        }

        // 设置列的默认水平对齐方式
        if (!column.align) {
            column.align = "left";
        }

        // 列排序
        if (column.sorter) {
            if (!is.plainObject(column.sorter)) {
                column.sorter = {};
            }

            if (!("order" in column.sorter)) {
                column.sorter.order = "none";
            }
        }

        // 列过滤
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
            column.children = addDefaultPropsToColumns(column.children, column);
        }

        // 返回填充属性后的列数据
        return column;
    });
};

/**
 * 为 data 配置填充默认选项
 * @param {Array} data 行数据
 */
const addDefaultPropsToData = (data, rowKey) => {
    return data.map(row => {
        // 返回填充属性后的行数据
        return row;
    });
};

/**
 * 将 columns 配置转换为一维数组形式
 * @param {Array} columns 列数据
 * @param {Boolean} keep 如果某列包含子列，展开子列前是否保留父列本身。可选，默认不保留
 */
export const getFlattenedColumns = (columns, keep = false) => {
    let result = [];

    columns.forEach(column => {
        if (column.children) {
            if (keep) {
                result.push(column);
            }

            result.push.apply(result, getFlattenedColumns(column.children, keep));
        }
        else {
            result.push(column);
        }
    });

    return result;
};

/**
 * 将 columns 配置解析为组件内部状态
 * @param {Array} columns 列数据
 */
export const getDerivedColumns = columns => {
    let result = clone(columns);

    result.sort((a, b) => {
        if (a.fixed === "left") {
            return b.fixed === "left" ? 0 : -1;
        }
        else if (a.fixed === "right") {
            return b.fixed === "right" ? 0 : 1;
        }
        else {
            return b.fixed === "left" ? 1 : (b.fixed === "right" ? -1 : 0);
        }
    });

    return addDefaultPropsToColumns(result);
};

/**
 * 将 data 配置解析为组件内部状态
 * @param {Array} data 行数据
 */
export const getDerivedData = data => {
    let result = clone(data);

    return addDefaultPropsToData(result);
};

/**
 * 获取表格 colgroup 数据，用于设置列宽
 * @param {Array} columns 列数据
 */
export const getDerivedColgroup = columns => getFlattenedColumns(columns);

/**
 * 获取表格 header 数据，用于设置表头
 * @param {Array} columns 列数据
 */
export const getDerivedHeader = columns => {
    let max = 1;
    let traverse = (column, parent) => {
        if (parent) {
            column.level = parent.level + 1;

            if (max < column.level) {
                max = column.level;
            }
        }

        if (column.children) {
            let colSpan = 0;

            column.children.forEach(child => {
                traverse(child, column);
                colSpan += child.colSpan;
            });

            column.colSpan = colSpan;
        }
        else {
            column.colSpan = 1;
        }
    };

    columns.forEach(column => {
        column.level = 1;
        traverse(column);
    });

    let rows = [];

    for (let i = 0; i < max; i++) {
        rows.push([]);
    }

    columns = getFlattenedColumns(columns, true);

    columns.forEach(column => {
        if (column.children) {
            column.rowSpan = 1;
        }
        else {
            column.rowSpan = max - column.level + 1;
        }

        rows[column.level - 1].push(column);
    });

    return rows;
};

/**
 * 按筛选条件重新生成表格 body 数据
 * @param {Array} data 行数据
 */
const filter = (column, data) => {
    const { dataIndex, filter } = column;

    return data.filter(row => filter.method(filter.value, clone(row)));
};

export const getDerivedBodyByFilter = (columns, data) => {
    columns = getFlattenedColumns(columns);

    columns.forEach(column => {
        if (column.filter && column.filter.method && !column.filter.useServerFilter) {
            data = filter(column, data);
        }
    });

    return data;
};

/**
 * 按排序方式重新生成表格 body 数据
 * @param {Array} data 行数据
 */
const sorter = (column, data) => {
    const { dataIndex, sorter } = column;

    data.sort((a, b) => {
        if (sorter.method) {
            return sorter.method(a, b, sorter.order);
        }
        else {
            if (sorter.order === "asc") {
                return a[dataIndex] > b[dataIndex] ? 1 : -1;
            }
            else if (sorter.order === "desc") {
                return a[dataIndex] < b[dataIndex] ? 1 : -1;
            }
            else {
                return 0;
            }
        }
    });

    return data;
};

export const getDerivedBodyBySorter = (columns, data) => {
    columns = getFlattenedColumns(columns);

    columns.forEach(column => {
        if (column.sorter && !column.sorter.useServerSort) {
            data = sorter(column, data);
        }
    });

    return data;
};

/**
 * 获取表格 body 数据，用于设置表格
 * @param {Array} data 行数据
 */
export const getDerivedBody = (columns, data) => {
    columns = clone(columns);
    data = clone(data);

    data = getDerivedBodyByFilter(columns, data);
    data = getDerivedBodyBySorter(columns, data);

    return data;
};

/**
 * 默认导出指定接口
 */
export default {
    getFlattenedColumns,
    getDerivedColumns,
    getDerivedData,
    getDerivedColgroup,
    getDerivedHeader,
    getDerivedBodyByFilter,
    getDerivedBodyBySorter,
    getDerivedBody
};