import VuiIcon from "vui-design/components/icon";
import VuiCheckbox from "vui-design/components/checkbox";
import VuiTooltip from "vui-design/components/tooltip";
import VuiTableFilter from "./table-filter";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import flatten from "vui-design/utils/flatten";
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
    fixed: PropTypes.string,
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
    maybeShowColumn(column) {
      const { $props: props } = this;
      let boolean = false;

      if (!props.fixed && !column.fixed) {
        boolean = true;
      }
      else if (props.fixed === "left" && column.fixed === "left") {
        boolean = true;
      }
      else if (props.fixed === "right" && column.fixed === "right") {
        boolean = true;
      }

      return boolean;
    },
    maybeShowColumnTooltip(column) {
      const { $props: props } = this;
      const maybeShowColumn = this.maybeShowColumn(column);
      let boolean = false;

      if (column.tooltip && maybeShowColumn) {
        boolean = true;
      }

      return boolean;
    },
    maybeShowColumnSorter(column) {
      const { $props: props } = this;
      const maybeShowColumn = this.maybeShowColumn(column);
      let boolean = false;

      if (column.sorter && maybeShowColumn) {
        boolean = true;
      }

      return boolean;
    },
    maybeShowColumnFilter(column) {
      const { $props: props } = this;
      const maybeShowColumn = this.maybeShowColumn(column);
      let boolean = false;

      if (column.filter && maybeShowColumn) {
        boolean = true;
      }

      return boolean;
    },
    getColumnClassName(type, column) {
      if (!column) {
        column = type;
        type = undefined;
      }

      const { $props: props } = this;
      const align = column.align || "center";
      const ellipsis = column.ellipsis;
      const className = column.className;

      if (type === "expansion") {
        return {
          [`${props.classNamePrefix}-column`]: true,
          [`${props.classNamePrefix}-column-align-${align}`]: align,
          [`${props.classNamePrefix}-column-ellipsis`]: ellipsis,
          [`${props.classNamePrefix}-column-with-expansion`]: true,
          [`${className}`]: className
        };
      }
      else if (type === "selection") {
        return {
          [`${props.classNamePrefix}-column`]: true,
          [`${props.classNamePrefix}-column-align-${align}`]: align,
          [`${props.classNamePrefix}-column-ellipsis`]: ellipsis,
          [`${props.classNamePrefix}-column-with-selection`]: true,
          [`${className}`]: className
        };
      }
      else {
        const maybeShowColumn = this.maybeShowColumn(column);
        const maybeShowColumnSorter = this.maybeShowColumnSorter(column);
        const maybeShowColumnFilter = this.maybeShowColumnFilter(column);

        return {
          [`${props.classNamePrefix}-column`]: true,
          [`${props.classNamePrefix}-column-align-${align}`]: align,
          [`${props.classNamePrefix}-column-ellipsis`]: ellipsis,
          [`${props.classNamePrefix}-column-hidden`]: !maybeShowColumn,
          [`${props.classNamePrefix}-column-with-sorter`]: maybeShowColumnSorter,
          [`${props.classNamePrefix}-column-with-filter`]: maybeShowColumnFilter,
          [`${className}`]: className
        };
      }
    },
    getColumnBodyClassName(column) {
      const { $props: props } = this;

      return {
        [`${props.classNamePrefix}-column-body`]: true
      };
    },
    getColumnExtraClassName(column) {
      const { $props: props } = this;

      return {
        [`${props.classNamePrefix}-column-extra`]: true
      };
    },
    getColumnTitleClassName(column) {
      const { $props: props } = this;

      return {
        [`${props.classNamePrefix}-column-title`]: true
      };
    },
    getColumnSelectionClassName(column, checked) {
      const { $props: props } = this;

      return {
        [`${props.classNamePrefix}-column-selection`]: true,
        [`active`]: checked
      };
    },
    getColumnTooltipClassName(column) {
      const { $props: props } = this;

      return {
        [`${props.classNamePrefix}-column-tooltip`]: true
      };
    },
    getColumnSorterClassName(column) {
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

      this.vuiTable.handleSort(clone(column), order);
    },
    handleFilter(column, value) {
      if (!column.filter) {
        return;
      }

      this.vuiTable.handleFilter(clone(column), value);
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
        const width = props.rowExpansion.width || 50;

        cols.push(
          <col key="expansion" width={width} />
        );
      }

      if (props.rowSelection) {
        const width = props.rowSelection.width || 50;

        cols.push(
          <col key="selection" width={width} />
        );
      }

      columns.forEach((column, columnIndex) => {
        cols.push(
          <col key={column.key || columnIndex} width={column.width} />
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
            >
              {props.rowExpansion.title}
            </th>
          );
        }

        if (props.rowSelection && rowIndex === 0) {
          let component;
          const isMultiple = utils.getSelectionMultiple(props.rowSelection);

          if (props.rowSelection.title) {
            component = (
              <div class={this.getColumnTitleClassName(props.rowSelection)}>
                {props.rowSelection.title}
              </div>
            );
          }
          else if (isMultiple) {
            let data = [];

            if (props.rowTreeview) {
              const property = props.rowTreeview.children || "children";

              data = flatten(props.tbody, property, true);
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
                class={this.getColumnSelectionClassName(props.rowSelection, status.checked)}
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
            <div class={this.getColumnTitleClassName(column)}>
              {is.function(column.title) ? column.title(h, clone(column), columnIndex) : column.title}
            </div>
          );

          if (this.maybeShowColumnTooltip(column)) {
            body.push(
              <div class={this.getColumnTooltipClassName(column)}>
                <VuiTooltip color={column.tooltip.color} placement={column.tooltip.placement} maxWidth={column.tooltip.maxWidth}>
                  <VuiIcon type={column.tooltip.icon} />
                  <div slot="content">{column.tooltip.content}</div>
                </VuiTooltip>
              </div>
            );
          }

          if (this.maybeShowColumnSorter(column)) {
            body.push(
              <div class={this.getColumnSorterClassName(column)}>
                <i class={this.getColumnSorterCaretClassName(column, "asc")}></i>
                <i class={this.getColumnSorterCaretClassName(column, "desc")}></i>
              </div>
            );
          }

          body = (
            <div class={this.getColumnBodyClassName(column)}>
              {body}
            </div>
          );

          let extra;

          if (this.maybeShowColumnFilter(column)) {
            extra = (
              <div class={this.getColumnExtraClassName(column)}>
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
              class={this.getColumnClassName(column)}
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