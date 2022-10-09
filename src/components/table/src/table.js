import VuiSpin from "../../spin";
import VuiAffix from "../../affix";
import VuiPagination from "../../pagination";
import VuiTableThead from "./table-thead";
import VuiTableTbody from "./table-tbody";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import clone from "../../../utils/clone";
import flatten from "../../../utils/flatten";
import csv from "../../../utils/csv";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";
import utils from "./utils";
import { createProps as createPaginationProps } from "../../pagination";

const createdPaginationProps = createPaginationProps();

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    columns: PropTypes.array.def([]),
    data: PropTypes.array.def([]),
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def("key"),
    rowClassName: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    loading: PropTypes.bool.def(false),
    size: PropTypes.oneOf(["small", "medium", "large"]).def("medium"),
    bordered: PropTypes.bool.def(false),
    striped: PropTypes.bool.def(false),
    showHeader: PropTypes.bool.def(true),
    affixHeader: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]).def(false),
    scroll: PropTypes.object,
    locale: PropTypes.object,
    pagination: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.shape({
        ...createdPaginationProps,
        position: PropTypes.oneOf(["top", "bottom", "both"]),
      })
    ]).def(false),
    rowTreeview: PropTypes.object,
    rowExpansion: PropTypes.object,
    rowSelection: PropTypes.object
  };
};

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
    VuiPagination,
    VuiTableThead,
    VuiTableTbody
  },
  props: createProps(),
  data() {
    const { $props: props } = this;
    const state = {
      columns: [],
      data: [],
      colgroup: [],
      thead: [],
      tbody: [],
      pagination: {},
      openedRowKeys: [],
      expandedRowKeys: [],
      selectedRowKeys: []
    };

    state.columns = utils.getColumns(props.columns);
    state.data = utils.getData(props.data);
    state.colgroup = utils.getColgroup(state);
    state.thead = utils.getThead(state);
    state.tbody = utils.getTbody(props, state);
    state.pagination = utils.getPagination(props.pagination);
    state.openedRowKeys = utils.getOpenedRowKeys(props);
    state.expandedRowKeys = utils.getExpandedRowKeys(props);
    state.selectedRowKeys = utils.getSelectedRowKeys(props);

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
        this.state.openedRowKeys = utils.getOpenedRowKeys(props);
        this.state.expandedRowKeys = utils.getExpandedRowKeys(props);
        this.state.selectedRowKeys = utils.getSelectedRowKeys(props);
      }
    },
    pagination: {
      deep: true,
      handler() {
        const { $props: props, state } = this;

        this.state.pagination = utils.getPagination(props.pagination, state.pagination);
      }
    },
    rowTreeview: {
      deep: true,
      handler() {
        const { $props: props } = this;

        this.state.openedRowKeys = utils.getOpenedRowKeys(props);
      }
    },
    rowExpansion: {
      deep: true,
      handler() {
        const { $props: props } = this;

        this.state.expandedRowKeys = utils.getExpandedRowKeys(props);
      }
    },
    rowSelection: {
      deep: true,
      handler() {
        const { $props: props } = this;

        this.state.selectedRowKeys = utils.getSelectedRowKeys(props);
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
    // 滚动到顶部
    scrollToTop() {
      const { $props: props } = this;

      if (props.scroll && props.scroll.y > 0 && props.scroll.scrollToTop !== false) {
        this.$refs.body.scrollTop = 0;
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

      const { header, body } = this.$refs;
      const target = e.target;
      const scrollLeft = target.scrollLeft;

      if (scrollLeft !== this.lastScrollLeft) {
        if (target === header && body) {
          body.scrollLeft = scrollLeft;
        }

        if (target === body && header) {
          header.scrollLeft = scrollLeft;
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
      const { $props: props } = this;

      if (!column.sorter) {
        return;
      }

      this.changeSorterColumnState(this.state.columns, column.key, order);

      if (!column.sorter.useServerSort) {
        this.state.tbody = utils.getTbody(props, this.state);
      }

      this.$emit("sort", clone(column), order);
    },
    // 页码切换事件回调函数
    handleChangePage(page) {
      this.state.pagination.page = page;
      this.scrollToTop();
      this.$emit("paging", page, this.state.pagination.pageSize);
    },
    // 页数切换事件回调函数
    handleChangePageSize(pageSize) {
      this.state.pagination.pageSize = pageSize;
      this.scrollToTop();
      this.$emit("paging", this.state.pagination.page, pageSize);
    }
  },
  render() {
    const { $props: props, state } = this;

    // 计算 style 样式
    const showXScrollbar = props.scroll && props.scroll.x > 0;
    const showYScrollbar = props.scroll && props.scroll.y > 0;
    let styles = {
      elHeader: {},
      elBody: {}
    };

    if (showXScrollbar) {
      styles.elBody.overflowX = `scroll`;
    }

    if (showYScrollbar) {
      styles.elHeader.overflowY = `scroll`;
      styles.elBody.height = `${props.scroll.y}px`;
      styles.elBody.overflowY = `scroll`;
    }

    // 计算 class 样式
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "table");
    const classes = {
      el: {
        [`${classNamePrefix}`]: true,
        [`${classNamePrefix}-${props.size}`]: props.size,
        [`${classNamePrefix}-bordered`]: props.bordered
      },
      elWrapper: `${classNamePrefix}-wrapper`,
      elHeader: `${classNamePrefix}-header`,
      elBody: `${classNamePrefix}-body`,
      elPagination: `${classNamePrefix}-pagination`
    };

    // 是否显示表头
    let header;

    if (props.showHeader) {
      header = (
        <div ref="header" class={classes.elHeader} style={styles.elHeader}>
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
    let tbody = state.tbody;

    if (state.pagination) {
      const page = utils.getPage(state.pagination.total || tbody.length, state.pagination);
      const pageSize = state.pagination.pageSize;

      if (tbody.length > pageSize || pageSize === Number.MAX_VALUE) {
        tbody = tbody.slice((page - 1) * pageSize, page * pageSize);
      }
    }

    const body = (
      <div ref="body" class={classes.elBody} style={styles.elBody} onScroll={this.handleScroll}>
        <VuiTableTbody
          classNamePrefix={classNamePrefix}
          columns={state.columns}
          data={state.data}
          colgroup={state.colgroup}
          thead={state.thead}
          tbody={tbody}
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
    );

    // 分页
    let showTopPagination = false;
    let showBottomPagination = false;
    let pagination;

    if (state.pagination) {
      let small = false;
      let total = state.pagination.total || state.tbody.length;

      if (state.pagination.small || props.size === "small") {
        small = true;
      }

      const paginationProps = {
        props: {
          ...state.pagination,
          small,
          total
        },
        on: {
          change: this.handleChangePage,
          changePageSize: this.handleChangePageSize
        }
      };

      showTopPagination = state.pagination.position === "top" || state.pagination.position === "both";
      showBottomPagination = state.pagination.position === "bottom" || state.pagination.position === "both";
      pagination = (
        <div class={classes.elPagination}>
          <VuiPagination {...paginationProps} />
        </div>
      );
    }

    return (
      <VuiSpin spinning={props.loading} class={classes.elWrapper}>
        {
          showTopPagination ? pagination : null
        }
        <div class={classes.el}>
          {header}
          {body}
        </div>
        {
          showBottomPagination ? pagination : null
        }
      </VuiSpin>
    );
  }
};

export default VuiTable;