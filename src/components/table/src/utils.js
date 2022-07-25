import is from "../../../utils/is";
import guid from "../../../utils/guid";
import clone from "../../../utils/clone";
import flatten from "../../../utils/flatten";
import getTargetByPath from "../../../utils/getTargetByPath";

// 
const rowTreeviewChildrenKey = "children";
const rowExpansionWidth = 50;
const rowSelectionWidth = 50;

// 判断事件源元素是否需要被忽略
const isIgnoreElements = (event, predicate) => {
  const e = event || window.event;
  const element = e.target || e.srcElement;

  return is.function(predicate) ? predicate(element) : false;
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
const getRowChildren = (row, childrenKey = "children") => row[childrenKey];

// 判断给定行是否可展开（用于树形结构，根据子行数量判断是否允许展开）
const getRowTogglable = (row, rowTreeview) => {
  const childrenKey = getTreeviewChildrenKey(rowTreeview);
  const children = getRowChildren(row, childrenKey);

  return is.array(children) && children.length > 0;
};

// 判断给定行是否可展开（用于展开功能，根据用户配置判断是否允许展开）
const getRowExpandable = (row, rowKey, rowExpansion) => {
  const predicate = rowExpansion.expandable;
  let expandable = true;

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

// 启用了树形表格时，获取子行对应的键名
const getTreeviewChildrenKey = rowTreeview => rowTreeview.children ? rowTreeview.children : rowTreeviewChildrenKey;

// 启用了折叠功能时，获取折叠操作列的列宽
const getExpansionWidth = rowExpansion => rowExpansion.width ? rowExpansion.width : rowExpansionWidth;

// 启用了选择功能时，获取选择方式（多选或单选）
const getSelectionMultiple = rowSelection => {
  let multiple = true;

  if ("multiple" in rowSelection) {
    multiple = rowSelection.multiple;
  }

  return multiple;
};

// 启用了选择功能时，获取选择操作列的列宽
const getSelectionWidth = rowSelection => rowSelection.width ? rowSelection.width : rowSelectionWidth;

// 启用了选择功能时，获取 Checkbox 或 Radio 组件的自定义属性
const getSelectionComponentProps = (row, rowKey, rowSelection) => {
  const getter = rowSelection.getComponentProps;
  let componentProps;

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

// 为 columns 配置填充缺省属性
const addColumnProperties = (array, parent) => {
  return array.map((target, targetIndex) => {
    let column = clone(target);

    // 填充 key 属性
    if (!("key" in column)) {
      column.key = "dataIndex" in column ? column.dataIndex : (parent ? `${parent.key}-${targetIndex}` : `${targetIndex}`);
    }

    // 如果存在父级，则 fixed 属性强制继承父级（表头分组中不支持对子列头设置 fixed 属性，否则将导致滚动时布局混乱）
    if (parent) {
      if (parent.fixed) {
        column.fixed = parent.fixed;
      }
      else {
        delete column.fixed;
      }
    }

    // 计算列在 fixed 模式下的位置及其偏移量
    if (column.fixed === "left" || column.fixed === "right") {
      // 
      const prev = array[targetIndex - 1];

      if (parent) {
        column.fixedFirst = parent.fixedFirst ? !prev : false;
      }
      else {
        column.fixedFirst = !prev || prev.fixed !== column.fixed;
      }

      // 
      const next = array[targetIndex + 1];

      if (parent) {
        column.fixedLast = parent.fixedLast ? !next : false;
      }
      else {
        column.fixedLast = !next || next.fixed !== column.fixed;
      }

      // 
      const startIndex = column.fixed === "left" ? 0 : (targetIndex + 1);
      const endIndex = column.fixed === "left" ? targetIndex : array.length;
      const offset = array.slice(startIndex, endIndex).reduce((a, b) => {
        if (b.children) {
          return a + flatten(b.children, "children").reduce((m, n) => m + (n.width ? n.width : 0), 0);
        }
        else {
          return a + (b.width ? b.width : 0);
        }
      }, 0);

      if (parent && parent.offset) {
        column.offset = offset + parent.offset;
      }
      else {
        column.offset = offset;
      }
    }

    // 填充层级属性
    column.level = parent ? (parent.level + 1) : 1;

    // 不支持对分组表头进行自定义表头列合并
    if (column.children) {
      column.colSpan = flatten(column.children, "children").length;
    }
    else if (!("colSpan" in column)){
      column.colSpan = 1;
    }

    // 设置列的默认水平对齐方式
    if (!column.align) {
      column.align = "left";
    }

    // 列提示
    if (column.tooltip) {
      if (!is.json(column.tooltip)) {
        column.tooltip = {
          content: column.tooltip
        };
      }

      if (!("icon" in column.tooltip)) {
        column.tooltip.icon = "help";
      }
    }

    // 列排序
    if (column.sorter) {
      if (!is.json(column.sorter)) {
        column.sorter = {};
      }

      if (!("order" in column.sorter)) {
        column.sorter.order = "none";
      }
    }

    // 列过滤
    if (column.filter) {
      if (!is.json(column.filter)) {
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
      column.children = addColumnProperties(column.children, column);
    }

    // 返回填充属性后的列数据
    return column;
  });
};

// 将 columns 属性解析为组件内部状态
export const getColumns = columns => {
  let array = columns.slice();

  // 根据 fixed 属性进行排序，fixed 为 left 排左侧，fixed 为 right 排右侧
  array.sort((a, b) => {
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

  // 填充缺省属性并返回
  return addColumnProperties(array);
};

// 将 data 属性解析为组件内部状态
// 这里使用数组的 slice 方法实现浅拷贝出于以下两种考虑：
// 1、防止内部排序逻辑改变原数组
// 2、防止数组中的对象在无变化时被复制成一个新对象，导致不必要的重新渲染
export const getData = data => data.slice();

// 获取表格 colgroup 数据，用于设置列宽及固定列偏移距离
export const getColgroup = state => flatten(state.columns, "children");

// 获取表格 thead 数据，用于渲染表格头
export const getThead = state => {
  const columns = flatten(state.columns, "children", true);
  const level = Math.max.apply(null, columns.map(column => column.level));
  let rows = [];

  for (let i = 0; i < level; i++) {
    rows.push([]);
  }

  columns.forEach(column => {
    if (column.children) {
      column.rowSpan = 1;
    }
    else {
      column.rowSpan = level - column.level + 1;
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
      const childrenKey = getTreeviewChildrenKey(props.rowTreeview);
      const children = getRowChildren(row, childrenKey);

      if (is.array(children) && children.length > 0) {
        row[childrenKey] = filter(column, children, props);
      }
    }

    return boolean;
  });
};

export const getTbodyByFilter = (columns, data, props) => {
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
      return method(a, b, order, clone(column));
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
    const childrenKey = getTreeviewChildrenKey(props.rowTreeview);

    data.forEach(row => {
      const children = getRowChildren(row, childrenKey);

      if (is.array(children) && children.length > 0) {
        row[childrenKey] = sorter(column, children, props);
      }
    });
  }

  return data;
};

export const getTbodyBySorter = (columns, data, props) => {
  columns.forEach(column => {
    if (column.sorter && !column.sorter.useServerSort) {
      data = sorter(column, data, props);
    }
  });

  return data;
};

// 获取表格 body 数据，用于渲染表格体
export const getTbody = (props, state) => {
  const columns = state.colgroup;
  let data = state.data;

  // 启用了本地筛选功能时进行筛选处理（包含了嵌套数据的筛选）
  data = getTbodyByFilter(columns, data, props);
  // 启用了本地排序功能时进行排序处理（包含了嵌套数据的排序）
  data = getTbodyBySorter(columns, data, props);

  return data;
};

// 默认导出指定接口
export default {
  isIgnoreElements,
  getRowKey,
  getRowChildren,
  getRowTogglable,
  getRowExpandable,
  getTreemap,
  getTreemapChildren,
  getTreemapParents,
  getTreeviewChildrenKey,
  getExpansionWidth,
  getSelectionWidth,
  getSelectionMultiple,
  getSelectionComponentProps,
  getSelectionComponentStatus,
  getColumns,
  getData,
  getColgroup,
  getThead,
  getTbodyByFilter,
  getTbodyBySorter,
  getTbody
};