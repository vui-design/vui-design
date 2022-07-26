import VuiIcon from "../../icon";
import VuiCheckbox from "../../checkbox";
import VuiTooltip from "../../tooltip";
import VuiTableFilter from "./table-filter";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import clone from "../../../utils/clone";
import flatten from "../../../utils/flatten";
import utils from "./utils";

const VuiTableThead = {
  name: "vui-table-thead",
  inject: {
    vuiTable: {
      default: undefined
    }
  },
  components: {
    VuiIcon,
    VuiCheckbox,
    VuiTooltip,
    VuiTableFilter
  },
  props: {
    classNamePrefix: PropTypes.string.def("vui-table"),
    columns: PropTypes.array.def([]),
    data: PropTypes.array.def([]),
    colgroup: PropTypes.array.def([]),
    thead: PropTypes.array.def([]),
    tbody: PropTypes.array.def([]),
    rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def("key"),
    rowTreeview: PropTypes.object,
    rowExpansion: PropTypes.object,
    rowSelection: PropTypes.object,
    selectedRowKeys: PropTypes.oneOfType([PropTypes.array, PropTypes.string, PropTypes.number]).def([]),
    scroll: PropTypes.object,
    locale: PropTypes.object
  },
  methods: {
    getColumnClassName(type, column) {
      const { $props: props } = this;
      const { fixedFirst, fixedLast, align = "center", ellipsis, className } = column;
      let fixed = column.fixed;

      if (type === "expansion" || type === "selection") {
        fixed = props.colgroup.findIndex(col => col.fixed === "left") > -1 ? "left" : undefined;
      }

      return {
        [`${props.classNamePrefix}-column`]: true,
        [`${props.classNamePrefix}-column-fixed-${fixed}`]: fixed,
        [`${props.classNamePrefix}-column-fixed-left-last`]: fixed === "left" && fixedLast,
        [`${props.classNamePrefix}-column-fixed-right-first`]: fixed === "right" && fixedFirst,
        [`${props.classNamePrefix}-column-align-${align}`]: align,
        [`${props.classNamePrefix}-column-ellipsis`]: ellipsis,
        [`${props.classNamePrefix}-column-with-${type}`]: type,
        [`${props.classNamePrefix}-column-with-sorter`]: column.sorter,
        [`${props.classNamePrefix}-column-with-filter`]: column.filter,
        [`${className}`]: className
      };
    },
    getColumnStyle(type, column) {
      const { $props: props } = this;

      if (type === "expansion" || type === "selection") {
        const isFixed = props.colgroup.findIndex(col => col.fixed === "left") > -1;

        if (isFixed) {
          let offset = 0;

          if (type === "selection" && props.rowExpansion) {
            offset = offset + (props.rowExpansion.width ? props.rowExpansion.width : 50);
          }

          return {
            left: offset + "px"
          };
        }
      }
      else if (column.fixed === "left") {
        let offset = column.offset;

        if (props.rowExpansion) {
          offset = offset + (props.rowExpansion.width ? props.rowExpansion.width : 50);
        }

        if (props.rowSelection) {
          offset = offset + (props.rowSelection.width ? props.rowSelection.width : 50);
        }

        return {
          left: offset + "px"
        };
      }
      else if (column.fixed === "right") {
        return {
          right: column.offset + "px"
        };
      }
    },
    getColumnBodyClassName() {
      const { $props: props } = this;

      return {
        [`${props.classNamePrefix}-column-body`]: true
      };
    },
    getColumnExtraClassName() {
      const { $props: props } = this;

      return {
        [`${props.classNamePrefix}-column-extra`]: true
      };
    },
    getColumnTitleClassName() {
      const { $props: props } = this;

      return {
        [`${props.classNamePrefix}-column-title`]: true
      };
    },
    getColumnSelectionClassName(checked) {
      const { $props: props } = this;

      return {
        [`${props.classNamePrefix}-column-selection`]: true,
        [`active`]: checked
      };
    },
    getColumnTooltipClassName() {
      const { $props: props } = this;

      return {
        [`${props.classNamePrefix}-column-tooltip`]: true
      };
    },
    getColumnSorterClassName() {
      const { $props: props } = this;

      return {
        [`${props.classNamePrefix}-column-sorter`]: true
      };
    },
    getColumnSorterCaretClassName(column, order) {
      const { $props: props } = this;

      return {
        [`${props.classNamePrefix}-column-sorter-caret`]: true,
        [`active`]: column.sorter.order === order
      };
    },
    handleSelectAll(checked) {
      this.vuiTable.handleSelectAll(checked);
    },
    handleSort(column) {
      if (!column.sorter) {
        return;
      }

      let order = column.sorter.order;

      if (order === "none") {
        order = "asc";
      }
      else if (order === "asc") {
        order = "desc";
      }
      else if (order === "desc") {
        order = "none";
      }

      this.vuiTable.handleSort(column, order);
    },
    handleFilter(column, value) {
      if (!column.filter) {
        return;
      }

      this.vuiTable.handleFilter(column, value);
    },
    getColgroup(h) {
      const { $props: props } = this;
      let cols = [];

      this.getColgroupChildren(h, cols, props.colgroup);

      return (
        <colgroup>{cols}</colgroup>
      );
    },
    getColgroupChildren(h, cols, columns) {
      const { $props: props } = this;

      if (props.rowExpansion) {
        cols.push(
          <col key="expansion" width={utils.getExpansionWidth(props.rowExpansion)} />
        );
      }

      if (props.rowSelection) {
        cols.push(
          <col key="selection" width={utils.getSelectionWidth(props.rowSelection)} />
        );
      }

      columns.forEach(column => {
        cols.push(
          <col key={column.key} width={column.width} />
        );
      });
    },
    getThead(h) {
      const { $props: props } = this;
      let trs = [];

      this.getTheadChildren(h, trs, props.thead);

      return (
        <thead>{trs}</thead>
      );
    },
    getTheadChildren(h, trs, rows) {
      const { $props: props } = this;

      rows.forEach((row, rowIndex) => {
        let ths = [];

        if (props.rowExpansion && rowIndex === 0) {
          ths.push(
            <th
              key="expansion"
              colspan="1"
              rowspan={rows.length}
              class={this.getColumnClassName("expansion", props.rowExpansion)}
              style={this.getColumnStyle("expansion", props.rowExpansion)}
            >
              {props.rowExpansion.title}
            </th>
          );
        }

        if (props.rowSelection && rowIndex === 0) {
          const isMultiple = utils.getSelectionMultiple(props.rowSelection);
          let component;

          if (props.rowSelection.title) {
            component = (
              <div class={this.getColumnTitleClassName()}>
                {props.rowSelection.title}
              </div>
            );
          }
          else if (isMultiple) {
            let data = [];

            if (props.rowTreeview) {
              data = flatten(props.tbody, utils.getTreeviewChildrenKey(props.rowTreeview), true);
            }
            else {
              data = props.tbody;
            }

            const status = utils.getSelectionComponentStatus(data, {
              rowKey: props.rowKey,
              rowSelection: props.rowSelection,
              selectedRowKeys: props.selectedRowKeys
            });

            component = (
              <VuiCheckbox
                class={this.getColumnSelectionClassName(status.checked)}
                indeterminate={status.indeterminate}
                checked={status.checked}
                disabled={status.disabled}
                validator={false}
                onChange={this.handleSelectAll}
              />
            );
          }

          ths.push(
            <th
              key="selection"
              colspan="1"
              rowspan={rows.length}
              class={this.getColumnClassName("selection", props.rowSelection)}
              style={this.getColumnStyle("selection", props.rowSelection)}
            >
              {component}
            </th>
          );
        }

        row.forEach((column, columnIndex) => {
          if (column.colSpan === 0) {
            return;
          }

          let body = [];

          body.push(
            <div class={this.getColumnTitleClassName()}>
              {is.function(column.title) ? column.title(h, clone(column), columnIndex) : column.title}
            </div>
          );

          if (column.tooltip) {
            body.push(
              <div class={this.getColumnTooltipClassName()}>
                <VuiTooltip color={column.tooltip.color} placement={column.tooltip.placement} maxWidth={column.tooltip.maxWidth}>
                  <VuiIcon type={column.tooltip.icon} />
                  <div slot="content">{column.tooltip.content}</div>
                </VuiTooltip>
              </div>
            );
          }

          if (column.sorter) {
            body.push(
              <div class={this.getColumnSorterClassName()}>
                <i class={this.getColumnSorterCaretClassName(column, "asc")}></i>
                <i class={this.getColumnSorterCaretClassName(column, "desc")}></i>
              </div>
            );
          }

          body = (
            <div class={this.getColumnBodyClassName()}>
              {body}
            </div>
          );

          let extra;

          if (column.filter) {
            extra = (
              <div class={this.getColumnExtraClassName()}>
                <VuiTableFilter
                  classNamePrefix={props.classNamePrefix}
                  options={column.filter.options}
                  multiple={column.filter.multiple}
                  value={column.filter.value}
                  locale={props.locale}
                  onChange={value => this.handleFilter(column, value)}
                />
              </div>
            );
          }

          ths.push(
            <th
              key={column.key || columnIndex}
              colspan={column.colSpan}
              rowspan={column.rowSpan}
              class={this.getColumnClassName(undefined, column)}
              style={this.getColumnStyle(undefined, column)}
              onClick={e => this.handleSort(column)}
            >
              {body}
              {extra}
            </th>
          );
        });

        trs.push(
          <tr key={rowIndex}>
            {ths}
          </tr>
        );
      });
    }
  },
  render(h) {
    const { $props: props } = this;
    const styles = {
      el: {
        width: props.scroll && props.scroll.x > 0 ? `${props.scroll.x}px` : `100%`
      }
    };

    return (
      <table border="0" cellpadding="0" cellspacing="0" style={styles.el}>
        {this.getColgroup(h)}
        {this.getThead(h)}
      </table>
    );
  }
};

export default VuiTableThead;