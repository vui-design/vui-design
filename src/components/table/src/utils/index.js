import guid from "vui-design/utils/guid";
import clone from "vui-design/utils/clone";
import flatten from "vui-design/utils/flatten";
import getTargetByPath from "vui-design/utils/getTargetByPath";
import is from "vui-design/utils/is";

// 判断事件源元素是否需要被忽略
const isIgnoreElements = (event, predicate) => {
    const e = event || window.event;
    const element = e.target || e.srcElement;

    return is.function(predicate) ? predicate(element) : false;
};

// 获取列数据的唯一键值
const getColumnKey = (column) => {
    let columnKey;

    if (column.key) {
        columnKey = column.key;
    }
    else if (column.dataIndex) {
        columnKey = column.dataIndex;
    }
    else {
        columnKey = guid();
    }

    return columnKey;
};

// 获取行数据的唯一键值
const getRowKey = (row, property) => {
    let rowKey;

    if (is.string(property)) {
        const target = getTargetByPath(row, property);

        rowKey = target.value;
    }
    else if (is.function(property)) {
        rowKey = property(clone(row));
    }
    else {
        rowKey = guid();
    }

    return rowKey;
};

// 获取子行数据
const getRowChildren = (row, childrenKey = "children") => {
    return row[childrenKey];
};

// 判断给定行是否可展开（用于树形结构，根据子行数量判断是否允许展开）
const getRowTogglable = (row, rowTreeview) => {
    const children = getRowChildren(row, rowTreeview.children);

    return is.array(children) && children.length > 0;
};

// 判断给定行是否可展开（用于展开功能，根据用户配置判断是否允许展开）
const getRowExpandable = (row, rowKey, rowExpansion) => {
    let expandable = true;
    const predicate = rowExpansion.expandable;

    if (is.function(predicate)) {
        expandable = predicate(clone(row), rowKey);
    }

    return expandable;
};

// 根据树形表格嵌套关系获取一维映射数组
const getTreemap = (rows, rowKey, childrenKey = "children", parentKey, array = []) => {
    rows.forEach(row => {
        const key = getRowKey(row, rowKey);

        array.push({
            key,
            parentKey,
            children: row[childrenKey] ? flatten(row[childrenKey], childrenKey, true) : [],
        });

        if (row[childrenKey]) {
            array.push.apply(array, getTreemap(row[childrenKey], rowKey, childrenKey, key));
        }
    });

    return array;
};

// 从 treemap 中获取给定行的所有子行
const getTreemapChildren = (treemap, rowKey, children = []) => {
    const target = treemap.find(element => element.key === rowKey);

    if (target) {
        children = target.children;
    }

    return children;
};

// 从 treemap 中获取给定行的所有父行
const getTreemapParents = (treemap, rowKey, parents = []) => {
    const target = treemap.find(row => row.key === rowKey);

    if (target && target.parentKey) {
        const parent = treemap.find(row => row.key === target.parentKey);

        if (parent) {
            parents.push(parent);
            getTreemapParents(treemap, parent.key, parents);
        }
    }

    return parents;
};

// 启用了选择功能时，获取选择方式（多选或单选）
const getSelectionMultiple = (rowSelection) => {
    let multiple = true;

    if ("multiple" in rowSelection) {
        multiple = rowSelection.multiple;
    }

    return multiple;
};

// 启用了选择功能时，获取 Checkbox 或 Radio 组件的自定义属性
const getSelectionComponentProps = (row, rowKey, rowSelection) => {
    let componentProps;
    const getter = rowSelection.getComponentProps;

    if (is.function(getter)) {
        componentProps = getter(clone(row), rowKey);
    }

    return componentProps;
};

// 根据所有子行的选择状态，获取父行复选框的 indeterminate、checked 以及 disabled 状态
const getSelectionComponentStatus = (rows, options) => {
    let rowsLength = 0;
    let selectedLength = 0;

    rows.forEach(row => {
        const rowKey = getRowKey(row, options.rowKey);
        const componentProps = getSelectionComponentProps(row, rowKey, options.rowSelection);
        const isEnabled = !componentProps || !componentProps.disabled;

        if (isEnabled) {
            rowsLength++;

            if (options.selectedRowKeys.indexOf(rowKey) > -1) {
                selectedLength++;
            }
        }
    });

    return {
        indeterminate: selectedLength > 0 && rowsLength > selectedLength,
        checked: rowsLength > 0 && rowsLength === selectedLength,
        disabled: rowsLength === 0
    };
};

// 将 columns 配置解析为组件内部状态
const addPropertiesToColumnsItem = (columns, parent) => {
    let isGroupingColumns= columns.some(column => "children" in column);

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

        // 表头分组中，不允许自定义表头列合并
        if (isGroupingColumns && "colSpan" in column) {
            delete column.colSpan;
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
            column.children = addPropertiesToColumnsItem(column.children, column);
        }

        // 返回填充属性后的列数据
        return column;
    });
};

export const getStateColumnsFromProps = columns => {
    columns = clone(columns);

    columns.sort((a, b) => {
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

    return addPropertiesToColumnsItem(columns);
};

// 将 data 配置解析为组件内部状态
const addPropertiesToDataItem = (data, rowKey) => {
    return data.map(row => row);
};

export const getStateDataFromProps = data => {
    data = clone(data);

    return addPropertiesToDataItem(data);
};

// 获取表格 colgroup 数据，用于设置列宽
export const getStateTableColgroup = state => flatten(state.columns, "children");

// 获取表格 thead 数据，用于渲染表格头
export const getStateTableThead = state => {
    let max = 1;
    const traverse = (column, parent) => {
        if (parent) {
            column.level = parent.level + 1;

            if (max < column.level) {
                max = column.level;
            }
        }
        else {
            column.level = 1;
        }

        if (column.children) {
            let colSpan = 0;

            column.children.forEach(element => {
                traverse(element, column);
                colSpan += element.colSpan;
            });

            column.colSpan = colSpan;
        }
        else {
            column.colSpan = "colSpan" in column ? column.colSpan : 1;
        }
    };

    state.columns.forEach(column => traverse(column));

    let rows = [];

    for (let i = 0; i < max; i++) {
        rows.push([]);
    }

    state.columns = flatten(state.columns, "children", true);

    state.columns.forEach(column => {
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

// 根据筛选条件生成表格 body 数据
const filter = (column, data, props) => {
    return data.filter(row => {
        const { method, value } = column.filter;
        const boolean = method(value, clone(row));

        if (boolean && props.rowTreeview) {
            const childrenKey = props.rowTreeview.children || "children";
            const children = getRowChildren(row, childrenKey);

            if (is.array(children) && children.length > 0) {
                row[childrenKey] = filter(column, children, props);
            }
        }

        return boolean;
    });
};

export const getStateTableTbodyByFilter = (columns, data, props) => {
    columns = flatten(columns, "children");

    columns.forEach(column => {
        if (column.filter && column.filter.method && !column.filter.useServerFilter) {
            data = filter(column, data, props);
        }
    });

    return data;
};

// 根据排序方式生成表格 body 数据
const sorter = (column, data, props) => {
    data.sort((a, b) => {
        const { dataIndex } = column;
        const { order, method } = column.sorter;

        if (method) {
            return method(a, b, order);
        }
        else {
            if (order === "asc") {
                return a[dataIndex] > b[dataIndex] ? 1 : -1;
            }
            else if (order === "desc") {
                return a[dataIndex] < b[dataIndex] ? 1 : -1;
            }
            else {
                return 0;
            }
        }
    });

    if (props.rowTreeview) {
        const childrenKey = props.rowTreeview.children || "children";

        data.forEach(row => {
            const children = getRowChildren(row, childrenKey);

            if (is.array(children) && children.length > 0) {
                row[childrenKey] = sorter(column, children, props);
            }
        });
    }

    return data;
};

export const getStateTableTbodyBySorter = (columns, data, props) => {
    columns = flatten(columns, "children");

    columns.forEach(column => {
        if (column.sorter && !column.sorter.useServerSort) {
            data = sorter(column, data, props);
        }
    });

    return data;
};

// 获取表格 body 数据，用于渲染表格体
export const getStateTableTbody = (props, state) => {
    let columns = clone(state.columns);
    let data = clone(state.data);

    // 启用了本地筛选功能时进行筛选处理（包含了嵌套数据的筛选）
    data = getStateTableTbodyByFilter(columns, data, props);
    // 启用了本地排序功能时进行排序处理（包含了嵌套数据的排序）
    data = getStateTableTbodyBySorter(columns, data, props);

    return data;
};

// 默认导出指定接口
export default {
    isIgnoreElements,
    getColumnKey,
    getRowKey,
    getRowChildren,
    getRowTogglable,
    getRowExpandable,
    getTreemap,
    getTreemapChildren,
    getTreemapParents,
    getSelectionMultiple,
    getSelectionComponentProps,
    getSelectionComponentStatus,
    getStateColumnsFromProps,
    getStateDataFromProps,
    getStateTableColgroup,
    getStateTableThead,
    getStateTableTbodyByFilter,
    getStateTableTbodyBySorter,
    getStateTableTbody
};