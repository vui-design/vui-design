import VuiEmpty from "vui-design/components/empty";
import VuiCheckbox from "vui-design/components/checkbox";
import VuiRadio from "vui-design/components/radio";
import Locale from "vui-design/mixins/locale";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import flatten from "vui-design/utils/flatten";
import getTargetByPath from "vui-design/utils/getTargetByPath";
import utils from "../utils";

const VuiTableTbody = {
	name: "vui-table-tbody",

	inject: {
		vuiTable: {
			default: undefined
		}
	},

	provide() {
		return {
			vuiTableTbody: this
		};
	},

	components: {
		VuiEmpty,
		VuiCheckbox,
		VuiRadio
	},

	mixins: [
		Locale
	],

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-table"
		},
		fixed: {
			type: String,
			default: undefined
		},
		columns: {
			type: Array,
			default: () => []
		},
		data: {
			type: Array,
			default: () => []
		},
		colgroup: {
			type: Array,
			default: () => []
		},
		thead: {
			type: Array,
			default: () => []
		},
		tbody: {
			type: Array,
			default: () => []
		},
		rowKey: {
			type: [String, Function],
			default: "key"
		},
		rowClassName: {
			type: [String, Function],
			default: undefined
		},
		rowTreeview: {
			type: Object,
			default: undefined
		},
		rowExpansion: {
			type: Object,
			default: undefined
		},
		rowSelection: {
			type: Object,
			default: undefined
		},
		hoveredRowKey: {
			type: [String, Number],
			default: undefined
		},
		openedRowKeys: {
			type: Array,
			default: () => []
		},
		expandedRowKeys: {
			type: Array,
			default: () => []
		},
		selectedRowKeys: {
			type: [Array, String, Number],
			default: () => []
		},
		scroll: {
			type: Object,
			default: undefined
		},
		locale: {
			type: Object,
			default: undefined
		}
	},

	methods: {
		isRowHovered(rowKey) {
			const { $props: props } = this;

			return props.hoveredRowKey === rowKey;
		},
		isRowOpened(rowKey) {
			const { $props: props } = this;

			if (!props.rowTreeview) {
				return false;
			}

			return props.openedRowKeys.indexOf(rowKey) > -1;
		},
		isRowExpanded(rowKey) {
			const { $props: props } = this;

			if (!props.rowExpansion) {
				return false;
			}

			return props.expandedRowKeys.indexOf(rowKey) > -1;
		},
		isRowSelected(rowKey) {
			const { $props: props } = this;

			if (!props.rowSelection) {
				return false;
			}

			const isMultiple = utils.getSelectionMultiple(props.rowSelection);

			if (isMultiple) {
				return props.selectedRowKeys.indexOf(rowKey) > -1;
			}
			else {
				return props.selectedRowKeys === rowKey;
			}
		},
		getRowClassName(type, row, rowIndex, rowKey) {
			const { $props: props } = this;

			if (type === "expansion") {
				return {
					[`${props.classNamePrefix}-row`]: true,
					[`${props.classNamePrefix}-row-expanded`]: true
				};
			}
			else {
				const stripe = rowIndex % 2 === 0 ? "even" : "odd";
				const isHovered = this.isRowHovered(rowKey);
				const isSelected = this.isRowSelected(rowKey);
				let className;

				if (is.string(props.rowClassName)) {
					className = row[props.rowClassName];
				}
				else if (is.function(props.rowClassName)) {
					className = props.rowClassName(row, rowIndex, rowKey);
				}

				return {
					[`${props.classNamePrefix}-row`]: true,
					[`${props.classNamePrefix}-row-${stripe}`]: stripe,
					[`${props.classNamePrefix}-row-hovered`]: isHovered,
					[`${props.classNamePrefix}-row-selected`]: isSelected,
					[`${className}`]: className
				};
			}
		},
		getColumnClassName(type, column, columnKey, row, rowKey) {
			const { $props: props } = this;
			const ellipsis = column.ellipsis;
			const align = column.align || "center";
			const className = column.className;

			if (type === "expansion") {
				return {
					[`${props.classNamePrefix}-column-with-expansion`]: true,
					[`${props.classNamePrefix}-column-ellipsis`]: ellipsis,
					[`${props.classNamePrefix}-column-align-${align}`]: align,
					[`${className}`]: className
				};
			}
			else if (type === "selection") {
				return {
					[`${props.classNamePrefix}-column-with-selection`]: true,
					[`${props.classNamePrefix}-column-ellipsis`]: ellipsis,
					[`${props.classNamePrefix}-column-align-${align}`]: align,
					[`${className}`]: className
				};
			}
			else {
				let maybeShowColumn = false;
				const maybeShowColumnSorter = column.sorter;
				const maybeShowColumnFilter = column.filter;

				let customizedClassName;

				if (!props.fixed && !column.fixed) {
					maybeShowColumn = true;
				}
				else if (props.fixed === "left" && column.fixed === "left") {
					maybeShowColumn = true;
				}
				else if (props.fixed === "right" && column.fixed === "right") {
					maybeShowColumn = true;
				}

				if (row.columnClassNames && columnKey && row.columnClassNames[columnKey]) {
					customizedClassName = row.columnClassNames[columnKey];
				}

				return {
					[`${props.classNamePrefix}-column-hidden`]: !maybeShowColumn,
					[`${props.classNamePrefix}-column-with-sorter`]: maybeShowColumnSorter,
					[`${props.classNamePrefix}-column-with-filter`]: maybeShowColumnFilter,
					[`${props.classNamePrefix}-column-ellipsis`]: ellipsis,
					[`${props.classNamePrefix}-column-align-${align}`]: align,
					[`${className}`]: className,
					[`${customizedClassName}`]: customizedClassName
				};
			}
		},
		getColumnSwitchClassName(column, opened) {
			const { $props: props } = this;

			return {
				[`${props.classNamePrefix}-column-switch`]: true,
				[`${props.classNamePrefix}-column-opened`]: opened
			};
		},
		getColumnExpansionClassName(column, expanded) {
			const { $props: props } = this;

			return {
				[`${props.classNamePrefix}-column-expansion`]: true,
				[`${props.classNamePrefix}-column-expanded`]: expanded
			};
		},
		getColumnSelectionClassName(column, selected) {
			const { $props: props } = this;

			return {
				[`${props.classNamePrefix}-column-selection`]: true,
				[`${props.classNamePrefix}-column-selected`]: selected
			};
		},
		handleRowMouseenter(event, row, rowIndex, rowKey) {
			const { vuiTable } = this;

			vuiTable.handleRowMouseenter(row, rowIndex, rowKey);
		},
		handleRowMouseleave(event, row, rowIndex, rowKey) {
			const { vuiTable } = this;

			vuiTable.handleRowMouseleave(row, rowIndex, rowKey);
		},
		handleRowClick(event, row, rowIndex, rowKey) {
			const { vuiTable, $props: props } = this;
			const { rowTreeview, rowExpansion } = props;

			vuiTable.handleRowClick(row, rowIndex, rowKey);

			if (rowTreeview && rowTreeview.clickRowToToggle) {
				const isTogglable = utils.getRowTogglable(row, rowTreeview);

				if (!isTogglable) {
					return;
				}

				const isIgnoreElements = utils.isIgnoreElements(event, rowTreeview.ignoreElements);

				if (isIgnoreElements) {
					return;
				}

				vuiTable.handleRowToggle(row, rowIndex, rowKey);
			}

			if (rowExpansion && rowExpansion.clickRowToExpand) {
				const isExpandable = utils.getRowExpandable(row, rowKey, rowExpansion);

				if (!isExpandable) {
					return;
				}

				const isIgnoreElements = utils.isIgnoreElements(event, rowExpansion.ignoreElements);

				if (isIgnoreElements) {
					return;
				}

				vuiTable.handleRowExpand(row, rowIndex, rowKey);
			}
		},
		handleRowDblclick(event, row, rowIndex, rowKey) {
			const { vuiTable } = this;

			vuiTable.handleRowDblclick(row, rowIndex, rowKey);
		},
		handleRowToggle(event, row, rowIndex, rowKey) {
			const { vuiTable, $props: props } = this;
			const { rowTreeview } = props;

			if (!rowTreeview) {
				return;
			}

			if (rowTreeview.clickRowToToggle) {
				return;
			}

			const isTogglable = utils.getRowTogglable(row, rowTreeview);

			if (!isTogglable) {
				return;
			}

			vuiTable.handleRowToggle(row, rowIndex, rowKey);
		},
		handleRowExpand(event, row, rowIndex, rowKey) {
			const { vuiTable, $props: props } = this;
			const { rowExpansion } = props;

			if (!rowExpansion) {
				return;
			}

			if (rowExpansion.clickRowToExpand) {
				return;
			}

			const isExpandable = utils.getRowExpandable(row, rowKey, rowExpansion);

			if (!isExpandable) {
				return;
			}

			vuiTable.handleRowExpand(row, rowIndex, rowKey);
		},
		handleRowSelect(checked, row, rowIndex, rowKey) {
			const { vuiTable } = this;

			vuiTable.handleRowSelect(checked, row, rowIndex, rowKey);
		},
		getColgroup(h) {
			const { $props: props } = this;
			let cols = [];

			this.gatherColgroupChildren(h, cols, props.colgroup);

			return (
				<colgroup>{cols}</colgroup>
			);
		},
		gatherColgroupChildren(h, cols, columns) {
			const { $props: props } = this;

			if (props.rowExpansion) {
				const { width = 50 } = props.rowExpansion;

				cols.push(
					<col key="expansion" width={width} />
				);
			}

			if (props.rowSelection) {
				const { width = 50 } = props.rowSelection;

				cols.push(
					<col key="selection" width={width} />
				);
			}

			columns.forEach((column, columnIndex) => {
				const columnKey = utils.getColumnKey(column);

				cols.push(
					<col key={columnKey} width={column.width} />
				);
			});
		},
		getTbody(h) {
			const { $props: props } = this;
			let trs = [];

			if (props.tbody.length === 0) {
				const { locale } = props;
				const description = locale && locale.empty ? locale.empty : this.t("vui.table.empty");
				let colspan = 0;

				if (props.rowExpansion) {
					colspan++;
				}

				if (props.rowSelection) {
					colspan++;
				}

				colspan += props.colgroup.length;

				trs.push(
					<tr>
						<td colspan={colspan}>
							<VuiEmpty description={description} style="padding: 40px 0;" />
						</td>
					</tr>
				);
			}
			else {
				this.rowIndex = 0;
				this.gatherTbodyChildren(h, trs, 1, props.tbody);
			}

			return (
				<tbody>{trs}</tbody>
			);
		},
		gatherTbodyChildren(h, trs, level, rows) {
			const { vuiTable, $props: props } = this;
			const { $scopedSlots: scopedSlots } = vuiTable;

			rows.forEach(row => {
				const rowKey = utils.getRowKey(row, props.rowKey);
				const rowIndex = this.rowIndex;
				let tds = [];

				if (props.rowExpansion) {
					const isExpandable = utils.getRowExpandable(row, rowKey, props.rowExpansion);
					const isRowExpanded = this.isRowExpanded(rowKey);
					let btnExpansion;

					if (isExpandable) {
						const btnExpansionAttributes = {
							class: this.getColumnExpansionClassName(props.rowExpansion, isRowExpanded),
							on: {
								click: e => this.handleRowExpand(e, row, rowIndex, rowKey)
							}
						};

						btnExpansion = (
							<button {...btnExpansionAttributes}></button>
						);
					}

					tds.push(
						<td key="expansion" class={this.getColumnClassName("expansion", props.rowExpansion)}>
							{btnExpansion}
						</td>
					);
				}

				if (props.rowSelection) {
					const isMultiple = utils.getSelectionMultiple(props.rowSelection);
					const isRowSelected = this.isRowSelected(rowKey);
					const componentProps = utils.getSelectionComponentProps(row, rowKey, props.rowSelection);
					let btnSelection;
					let btnSelectionAttributes = {
						class: this.getColumnSelectionClassName(props.rowSelection, isRowSelected),
						props: {
							checked: isRowSelected
						},
						on: {
							change: checked => this.handleRowSelect(checked, row, rowIndex, rowKey)
						}
					};

					if (props.rowTreeview && isMultiple && !props.rowSelection.strictly) {
						const childrenKey = props.rowTreeview.children;
						const children = utils.getRowChildren(row, childrenKey);

						if (is.array(children) && children.length > 0) {
							const status = utils.getSelectionComponentStatus(flatten(children, childrenKey, true), {
								rowKey: props.rowKey,
								rowSelection: props.rowSelection,
								selectedRowKeys: props.selectedRowKeys
							});

							btnSelectionAttributes.props.indeterminate = status.indeterminate;
						}
					}

					if (componentProps) {
						btnSelectionAttributes.props = {
							...componentProps,
							...btnSelectionAttributes.props
						};
					}

					if (isMultiple) {
						btnSelection = (
							<VuiCheckbox {...btnSelectionAttributes} />
						);
					}
					else {
						btnSelection = (
							<VuiRadio {...btnSelectionAttributes} />
						);
					}

					tds.push(
						<td key="selection" class={this.getColumnClassName("selection", props.rowSelection)}>
							{btnSelection}
						</td>
					);
				}

				props.colgroup.forEach((column, columnIndex) => {
					const cellProps = column.cellProps;
					let columnCellProps = {};

					if (is.plainObject(cellProps)) {
						columnCellProps.attrs = cellProps;
					}
					else if (is.function(cellProps)) {
						columnCellProps.attrs = cellProps({
							row: clone(row),
							rowIndex: rowIndex,
							column: clone(column),
							columnIndex: columnIndex
						});
					}

					if (columnCellProps.attrs && (columnCellProps.attrs.rowSpan === 0 || columnCellProps.attrs.colSpan === 0)) {
						return;
					}

					let btnSwitches = [];

					if (props.rowTreeview && columnIndex === 0) {
						const lastLevelIndex = level - 1;

						for (let i = 0; i < level; i++) {
							const childrenKey = props.rowTreeview.children;
							const children = utils.getRowChildren(row, childrenKey);
							let btnSwitchAttributes;

							if (i === lastLevelIndex && is.array(children) && children.length > 0) {
								const isRowOpened = this.isRowOpened(rowKey);

								btnSwitchAttributes = {
									class: this.getColumnSwitchClassName(props.rowTreeview, isRowOpened),
									on: {
										click: e => this.handleRowToggle(e, row, rowIndex, rowKey)
									}
								};
							}
							else {
								btnSwitchAttributes = {
									class: this.getColumnSwitchClassName(props.rowTreeview, false),
									style: {
										visibility: "hidden"
									}
								};
							}

							btnSwitches.push(
								<button {...btnSwitchAttributes}></button>
							);
						}
					}

					const columnKey = utils.getColumnKey(column);
					let content;

					if (column.slot) {
						const scopedSlot = scopedSlots[column.slot];

						content = scopedSlot && scopedSlot({
							row: clone(row),
							rowIndex: rowIndex,
							column: clone(column),
							columnIndex: columnIndex
						});
					}
					else if (column.render) {
						content = column.render(h, {
							row: clone(row),
							rowIndex: rowIndex,
							column: clone(column),
							columnIndex: columnIndex
						});
					}
					else {
						const target = getTargetByPath(row, column.dataIndex);

						content = target.value;
					}

					tds.push(
						<td key={columnKey} class={this.getColumnClassName("", column, columnKey, row, rowKey)} {...columnCellProps}>
							{btnSwitches}
							{content}
						</td>
					);
				});

				trs.push(
					<tr
						key={rowKey}
						class={this.getRowClassName("", row, rowIndex, rowKey)}
						onMouseenter={e => this.handleRowMouseenter(e, row, rowIndex, rowKey)}
						onMouseleave={e => this.handleRowMouseleave(e, row, rowIndex, rowKey)}
						onClick={e => this.handleRowClick(e, row, rowIndex, rowKey)}
						onDblclick={e => this.handleRowDblclick(e, row, rowIndex, rowKey)}
					>
						{tds}
					</tr>
				);

				if (props.rowExpansion && this.isRowExpanded(rowKey)) {
					let content;

					if (props.rowExpansion.slot) {
						const scopedSlot = scopedSlots[props.rowExpansion.slot];

						content = scopedSlot && scopedSlot({
							row: clone(row),
							rowIndex: rowIndex
						});
					}
					else if (props.rowExpansion.render) {
						content = props.rowExpansion.render(h, {
							row: clone(row),
							rowIndex: rowIndex
						});
					}

					trs.push(
						<tr key={rowKey + "-expansion"} class={this.getRowClassName("expansion", row, rowIndex, rowKey)}>
							<td></td>
							<td colspan={props.colgroup.length}>{content}</td>
						</tr>
					);
				}

				this.rowIndex++;

				if (props.rowTreeview && this.isRowOpened(rowKey)) {
					const childrenKey = props.rowTreeview.children;
					const children = utils.getRowChildren(row, childrenKey);

					if (is.array(children) && children.length > 0) {
						this.gatherTbodyChildren(h, trs, level + 1, children);
					}
				}
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
				{this.getTbody(h)}
			</table>
		);
	}
};

export default VuiTableTbody;