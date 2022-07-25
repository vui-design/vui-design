import VuiSpin from "../../spin";
import VuiAffix from "../../affix";
import VuiTableThead from "./table-thead";
import VuiTableTbody from "./table-tbody";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import clone from "../../../utils/clone";
import flatten from "../../../utils/flatten";
import getTargetByPath from "../../../utils/getTargetByPath";
import getScrollbarSize from "../../../utils/getScrollbarSize";
import csv from "../../../utils/csv";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";
import utils from "./utils";

const VuiTable = {
  name: "vui-table",
  provide() {
    return {
      vuiTable: this
    };
  },
  components: {
    VuiSpin,
    VuiAffix,
    VuiTableThead,
    VuiTableTbody
  },
  props: {
    classNamePrefix: PropTypes.string,
    columns: PropTypes.array.def([]),
    data: PropTypes.array.def([]),
    rowTreeview: PropTypes.object,
    rowExpansion: PropTypes.object,
    rowSelection: PropTypes.object,
    showHeader: PropTypes.bool.def(true),
    affixHeader: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).def(false),
    size: PropTypes.oneOf(["small", "medium", "large"]).def("medium"),
    bordered: PropTypes.bool.def(false),
    striped: PropTypes.bool.def(false),
    scroll: PropTypes.object,
    loading: PropTypes.bool.def(false),
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def("key"),
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    locale: PropTypes.object
  },
  data() {
    const state = {
      columns: [],
      data: [],
      colgroup: [],
      thead: [],
      tbody: [],
      openedRowKeys: [],
      expandedRowKeys: [],
      selectedRowKeys: []
    };

    return {
      state
    };
  },
  watch: {
    columns: {
      handler(value) {
        const { $props: props } = this;

        this.state.columns = utils.getColumns(value);
        this.state.colgroup = utils.getColgroup(this.state);
        this.state.thead = utils.getThead(this.state);
        this.state.tbody = utils.getTbody(props, this.state);
      }
    },
    data: {
      handler(value) {
        const { $props: props } = this;

        this.state.data = utils.getData(value);
        this.state.tbody = utils.getTbody(props, this.state);
      }
    },
    rowTreeview: {
      deep: true,
      handler(options) {
        if (options && is.array(options.value)) {
          this.state.openedRowKeys = clone(options.value);
        }
      }
    },
    rowExpansion: {
      deep: true,
      handler(options) {
        if (options && is.array(options.value)) {
          this.state.expandedRowKeys = clone(options.value);
        }
      }
    },
    rowSelection: {
      deep: true,
      handler(options) {
        if (options) {
          const isMultiple = utils.getSelectionMultiple(options);

          if (isMultiple) {
            if (is.array(options.value)) {
              this.state.selectedRowKeys = clone(options.value);
            }
          }
          else {
            if (is.string(options.value) || is.number(options.value)) {
              this.state.selectedRowKeys = options.value;
            }
          }
        }
      }
    }
  },
  methods: {
    // 导出
    export(options) {
      const { state } = this;
      let settings = clone(options);

      if (settings.filename) {
        settings.filename = settings.filename.indexOf(".csv") > -1 ? settings.filename : (settings.filename + ".csv");
      }
      else {
        settings.filename = "table.csv";
      }

      if (!("original" in settings)) {
        settings.original = true;
      }

      if (!("showHeader" in settings)) {
        settings.showHeader = true;
      }

      let columns = [];
      let data = [];

      if (settings.columns && settings.data) {
        columns = settings.columns;
        data = settings.data;
      }
      else {
        columns = flatten(state.columns, "children");
        data = settings.original ? state.data : state.tbody;
      }

      const content = csv(columns, data, settings);

      if (is.function(settings.callback)) {
        settings.callback(content);
      }
      else {
        csv.export(settings.filename, content);
      }
    },
    // 更新筛选列的状态
    changeFilterColumnState(columns, key, value) {
      columns = flatten(columns, "children", true);

      columns.forEach(column => {
        if (column.key === key && column.filter) {
          column.filter.value = value;
        }
      });
    },
    // 更新排序列的状态
    changeSorterColumnState(columns, key, order) {
      columns = flatten(columns, "children", true);

      columns.forEach(column => {
        if (column.sorter) {
          column.sorter.order = column.key === key ? order : "none";
        }
      });
    },
    // 更新横向滚动位置
    changeScrollPosition(e) {
      if (e.currentTarget !== e.target) {
        return;
      }

      const { tableHeaderScrollbar, tableBodyScrollbar } = this.$refs;
      const target = e.target;
      const scrollLeft = target.scrollLeft;

      if (scrollLeft !== this.lastScrollLeft) {
        if (target === tableHeaderScrollbar && tableBodyScrollbar) {
          tableBodyScrollbar.scrollLeft = scrollLeft;
        }

        if (target === tableBodyScrollbar && tableHeaderScrollbar) {
          tableHeaderScrollbar.scrollLeft = scrollLeft;
        }
      }

      this.lastScrollLeft = scrollLeft;
    },
    // 滚动事件回调函数
    handleScroll(e) {
      this.changeScrollPosition(e);
    },
    // 行点击事件回调函数
    handleRowClick(row, rowIndex, rowKey) {
      this.$emit("rowClick", row, rowIndex, rowKey);
    },
    // 行双击事件回调函数
    handleRowDblclick(row, rowIndex, rowKey) {
      this.$emit("rowDblclick", row, rowIndex, rowKey);
    },
    // 行切换事件回调函数
    handleRowToggle(row, rowIndex, rowKey) {
      const { $props: props } = this;

      if (!props.rowTreeview) {
        return;
      }

      const index = this.state.openedRowKeys.indexOf(rowKey);

      if (index === -1) {
        this.state.openedRowKeys.push(rowKey);
      }
      else {
        this.state.openedRowKeys.splice(index, 1);
      }

      this.$emit("rowToggle", clone(this.state.openedRowKeys));
    },
    // 行展开事件回调函数
    handleRowExpand(row, rowIndex, rowKey) {
      const { $props: props } = this;

      if (!props.rowExpansion) {
        return;
      }

      const index = this.state.expandedRowKeys.indexOf(rowKey);

      if (props.rowExpansion.accordion) {
        this.state.expandedRowKeys = index === -1 ? [rowKey] : [];
      }
      else {
        if (index === -1) {
          this.state.expandedRowKeys.push(rowKey);
        }
        else {
          this.state.expandedRowKeys.splice(index, 1);
        }
      }

      this.$emit("rowExpand", clone(this.state.expandedRowKeys));
    },
    // 行选择事件回调函数
    handleRowSelect(checked, row, rowIndex, rowKey) {
      const { $props: props } = this;

      if (!props.rowSelection) {
        return;
      }

      const isMultiple = utils.getSelectionMultiple(props.rowSelection);

      if (isMultiple) {
        if (props.rowTreeview && !props.rowSelection.strictly) {
          const treemap = utils.getTreemap(this.state.tbody, props.rowKey, props.rowTreeview.children);
          const children = utils.getTreemapChildren(treemap, rowKey);
          const parents = utils.getTreemapParents(treemap, rowKey);
          const index = this.state.selectedRowKeys.indexOf(rowKey);

          if (checked) {
            if (index === -1) {
              this.state.selectedRowKeys.push(rowKey);
            }
          }
          else {
            if (index > -1) {
              this.state.selectedRowKeys.splice(index, 1);
            }
          }

          if (children && children.length > 0) {
            children.forEach(child => {
              const childKey = utils.getRowKey(child, props.rowKey);
              const componentProps = utils.getSelectionComponentProps(child, childKey, props.rowSelection);
              const isEnabled = !componentProps || !componentProps.disabled;

              if (!isEnabled) {
                return;
              }

              const index = this.state.selectedRowKeys.indexOf(childKey);

              if (checked) {
                if (index === -1) {
                  this.state.selectedRowKeys.push(childKey);
                }
              }
              else {
                if (index > -1) {
                  this.state.selectedRowKeys.splice(index, 1);
                }
              }
            });
          }

          if (parents && parents.length > 0) {
            parents.forEach(parent => {
              const parentKey = parent.key;
              const status = utils.getSelectionComponentStatus(parent.children, {
                rowKey: props.rowKey,
                rowSelection: props.rowSelection,
                selectedRowKeys: this.state.selectedRowKeys
              });
              const index = this.state.selectedRowKeys.indexOf(parentKey);

              if (status.checked) {
                if (index === -1) {
                  this.state.selectedRowKeys.push(parentKey);
                }
              }
              else {
                if (index > -1) {
                  this.state.selectedRowKeys.splice(index, 1);
                }
              }
            });
          }
        }
        else {
          const index = this.state.selectedRowKeys.indexOf(rowKey);

          if (checked) {
            if (index === -1) {
              this.state.selectedRowKeys.push(rowKey);
            }
          }
          else {
            if (index > -1) {
              this.state.selectedRowKeys.splice(index, 1);
            }
          }
        }
      }
      else {
        this.state.selectedRowKeys = checked ? rowKey : undefined;
      }

      this.$emit("rowSelect", clone(this.state.selectedRowKeys));
    },
    // 行鼠标移入事件回调函数
    handleRowMouseenter(row, rowIndex, rowKey) {
      this.$emit("rowMouseenter", row, rowIndex, rowKey);
    },
    // 行鼠标移出事件回调函数
    handleRowMouseleave(row, rowIndex, rowKey) {
      this.$emit("rowMouseleave", row, rowIndex, rowKey);
    },
    // 全选&取消全选事件回调函数
    handleSelectAll(checked) {
      const { $props: props } = this;

      // 以下两种情况返回不处理
      // 1、未启用行选择功能
      // 2、已启用行选择功能，但是使用单选模式
      if (!props.rowSelection || props.rowSelection.multiple === false) {
        return;
      }

      // 
      let rows = [];

      if (props.rowTreeview) {
        rows = flatten(this.state.tbody, props.rowTreeview.children, true);
      }
      else {
        rows = this.state.tbody;
      }

      rows.forEach((row, rowIndex) => {
        const rowKey = utils.getRowKey(row, props.rowKey);
        const componentProps = utils.getSelectionComponentProps(row, rowKey, props.rowSelection);
        const isEnabled = !componentProps || !componentProps.disabled;

        if (!isEnabled) {
          return;
        }

        const index = this.state.selectedRowKeys.indexOf(rowKey);

        if (checked) {
          if (index === -1) {
            this.state.selectedRowKeys.push(rowKey);
          }
        }
        else {
          if (index > -1) {
            this.state.selectedRowKeys.splice(index, 1);
          }
        }
      });

      this.$emit("rowSelect", clone(this.state.selectedRowKeys));
    },
    // 筛选事件回调函数
    handleFilter(column, value) {
      const { $props: props } = this;

      if (!column.filter) {
        return;
      }

      this.changeFilterColumnState(this.state.columns, column.key, value);

      if (!column.filter.useServerFilter) {
        this.state.tbody = utils.getTbody(props, this.state);
      }

      this.$emit("filter", clone(column), value);
    },
    // 排序事件回调函数
    handleSort(column, order) {
      let { $props: props } = this;

      if (!column.sorter) {
        return;
      }

      this.changeSorterColumnState(this.state.columns, column.key, order);

      if (!column.sorter.useServerSort) {
        this.state.tbody = utils.getTbody(props, this.state);
      }

      this.$emit("sort", clone(column), order);
    }
  },
  created() {
    const { $props: props } = this;
    const { rowTreeview, rowExpansion, rowSelection } = props;

    let openedRowKeys = [];
    let expandedRowKeys = [];
    let selectedRowKeys = [];

    if (rowTreeview && is.array(rowTreeview.value)) {
      openedRowKeys = clone(rowTreeview.value);
    }

    if (rowExpansion && is.array(rowExpansion.value)) {
      expandedRowKeys = clone(rowExpansion.value);
    }

    if (rowSelection) {
      const isMultiple = utils.getSelectionMultiple(rowSelection);

      if (isMultiple) {
        selectedRowKeys = is.array(rowSelection.value) ? clone(rowSelection.value) : [];
      }
      else {
        selectedRowKeys = is.string(rowSelection.value) || is.number(rowSelection.value) ? rowSelection.value : undefined;
      }
    }

    this.state.columns = utils.getColumns(props.columns);
    this.state.data = utils.getData(props.data);
    this.state.colgroup = utils.getColgroup(this.state);
    this.state.thead = utils.getThead(this.state);
    this.state.tbody = utils.getTbody(props, this.state);
    this.state.openedRowKeys = openedRowKeys;
    this.state.expandedRowKeys = expandedRowKeys;
    this.state.selectedRowKeys = selectedRowKeys;
  },
  render() {
    const { $props: props, state } = this;
    let header;
    let body;

    // 计算 style 样式
    let showXScrollbar = props.scroll && props.scroll.x > 0;
    let showYScrollbar = props.scroll && props.scroll.y > 0;
    let styles = {
      elHeaderScrollbar: {},
      elBodyScrollbar: {}
    };

    if (showXScrollbar) {
      styles.elBodyScrollbar.overflowX = `scroll`;
    }

    if (showYScrollbar) {
      styles.elHeaderScrollbar.overflowY = `scroll`;
      styles.elBodyScrollbar.height = `${props.scroll.y}px`;
      styles.elBodyScrollbar.overflowY = `scroll`;
    }

    // 计算 class 样式
    let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "table");
    let classes = {
      el: {
        [`${classNamePrefix}`]: true,
        [`${classNamePrefix}-${props.size}`]: props.size,
        [`${classNamePrefix}-bordered`]: props.bordered
      },
      elHeader: `${classNamePrefix}-header`,
      elHeaderScrollbar: `${classNamePrefix}-header-scrollbar`,
      elBody: `${classNamePrefix}-body`,
      elBodyScrollbar: `${classNamePrefix}-body-scrollbar`
    };

    // 是否显示表头
    if (props.showHeader) {
      header = (
        <div ref="tableHeader" class={classes.elHeader}>
          <div ref="tableHeaderScrollbar" style={styles.elHeaderScrollbar} class={classes.elHeaderScrollbar}>
            <VuiTableThead
              classNamePrefix={classNamePrefix}
              columns={state.columns}
              data={state.data}
              colgroup={state.colgroup}
              thead={state.thead}
              tbody={state.tbody}
              rowKey={props.rowKey}
              rowTreeview={props.rowTreeview}
              rowExpansion={props.rowExpansion}
              rowSelection={props.rowSelection}
              selectedRowKeys={state.selectedRowKeys}
              scroll={props.scroll}
              locale={props.locale}
            />
          </div>
        </div>
      );

      if (props.affixHeader) {
        let affixHeader = props.affixHeader;

        if (!is.json(affixHeader)) {
          affixHeader = {};
        }

        header = (
          <VuiAffix offsetTop={affixHeader.offsetTop} offsetBottom={affixHeader.offsetBottom} getScrollContainer={affixHeader.getScrollContainer}>
            {header}
          </VuiAffix>
        );
      }
    }

    // 表格内容
    body = (
      <div ref="tableBody" class={classes.elBody}>
        <div ref="tableBodyScrollbar" class={classes.elBodyScrollbar} style={styles.elBodyScrollbar} onScroll={this.handleScroll}>
          <VuiTableTbody
            classNamePrefix={classNamePrefix}
            columns={state.columns}
            data={state.data}
            colgroup={state.colgroup}
            thead={state.thead}
            tbody={state.tbody}
            rowKey={props.rowKey}
            rowClassName={props.rowClassName}
            rowTreeview={props.rowTreeview}
            rowExpansion={props.rowExpansion}
            rowSelection={props.rowSelection}
            openedRowKeys={state.openedRowKeys}
            expandedRowKeys={state.expandedRowKeys}
            selectedRowKeys={state.selectedRowKeys}
            striped={props.striped}
            scroll={props.scroll}
            locale={props.locale}
          />
        </div>
      </div>
    );

    return (
      <VuiSpin spinning={props.loading}>
        <div class={classes.el}>
          {header}
          {body}
        </div>
      </VuiSpin>
    );
  }
};

export default VuiTable;