import VuiCheckbox from "vui-design/components/checkbox";
import VuiRadio from "vui-design/components/radio";
import VuiEmpty from "vui-design/components/empty";
import Locale from "vui-design/mixins/locale";
import is from "vui-design/utils/is";
import noop from "vui-design/utils/noop";
import clone from "vui-design/utils/clone";

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
		VuiCheckbox,
		VuiRadio,
		VuiEmpty
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
		scroll: {
			type: Object,
			default: undefined
		},
		getRowKey: {
			type: [String, Function],
			default: "key"
		},
		getRowClassName: {
			type: [String, Function],
			default: undefined
		},
		rowCollapsion: {
			type: Object,
			default: undefined
		},
		rowSelection: {
			type: Object,
			default: undefined
		},
		locale: {
			type: Object,
			default: undefined
		},
		store: {
			type: Object,
			default: undefined,
			required: true
		}
	},

	computed: {
		styles() {
			let scroll = this.scroll;
			let styles = {};
			let width;

			if (scroll && scroll.x > 0) {
				width = scroll.x + "px";
			}
			else {
				width = "100%";
			}

			styles.el = {
				width
			};

			return styles;
		},
		classes() {
			let classNamePrefix = this.classNamePrefix;
			let classes = {};

			classes.elColumnCollapsion = `${classNamePrefix}-column-collapsion`;
			classes.elColumnSelection = `${classNamePrefix}-column-selection`;

			return classes;
		},
		emptyText() {
			const { locale, t } = this;

			if (locale && locale.empty) {
				return locale.empty;
			}
			else {
				return t("vui.table.empty");
			}
		}
	},

	methods: {
		isRowCollapsed(rowKey) {
			if (!this.rowCollapsion) {
				return false;
			}

			return this.store.rowCollapsionState.indexOf(rowKey) > -1;
		},
		isRowSelected(rowKey) {
			if (!this.rowSelection) {
				return false;
			}

			let isMultiple = !("multiple" in this.rowSelection) || this.rowSelection.multiple;

			if (isMultiple) {
				return this.store.rowSelectionState.indexOf(rowKey) > -1;
			}
			else {
				return this.store.rowSelectionState === rowKey;
			}
		},
		isRowHovered(rowKey) {
			return this.store.rowHoverionState === rowKey;
		},
		getTrKey(row, rowIndex) {
			let getRowKey = this.getRowKey;
			let key;

			if (is.string(getRowKey)) {
				key = row[getRowKey];
			}
			else if (is.function(getRowKey)) {
				key = getRowKey(row);
			}
			else {
				key = rowIndex;
			}

			return key;
		},
		getTrClasses(row, rowIndex, rowKey) {
			let classNamePrefix = this.classNamePrefix;
			let getRowClassName = this.getRowClassName;
			let className;
			let stripe = rowIndex % 2 === 0 ? "even" : "odd";
			let isSelected = this.isRowSelected(rowKey);
			let isHovered = this.isRowHovered(rowKey);

			if (is.string(getRowClassName)) {
				className = row[getRowClassName];
			}
			else if (is.function(getRowClassName)) {
				className = getRowClassName(row, rowIndex, rowKey);
			}

			return {
				[`${classNamePrefix}-row`]: true,
				[`${className}`]: className,
				[`${classNamePrefix}-row-${stripe}`]: stripe,
				[`${classNamePrefix}-row-selected`]: isSelected,
				[`${classNamePrefix}-row-hovered`]: isHovered
			};
		},
		getCollapsionTrClasses() {
			let classNamePrefix = this.classNamePrefix;

			return {
				[`${classNamePrefix}-row-collapsed`]: true
			};
		},
		getTdKey(column, columnIndex) {
			let key;

			if ("key" in column) {
				key = column.key;
			}
			else if ("dataIndex" in column) {
				key = column.dataIndex;
			}
			else {
				key = columnIndex;
			}

			return key;
		},
		getTdClasses(row, column, columnKey) {
			let classNamePrefix = this.classNamePrefix;
			let fixed = this.fixed;
			let className;

			if (row.columnClassNames && columnKey && row.columnClassNames[columnKey]) {
				className = row.columnClassNames[columnKey];
			}

			return {
				[`${column.className}`]: column.className,
				[`${className}`]: className,
				[`${classNamePrefix}-column-align-${column.align}`]: column.align,
				[`${classNamePrefix}-column-ellipsis`]: column.ellipsis,
				[`${classNamePrefix}-column-with-sorter`]: column.sorter,
				[`${classNamePrefix}-column-with-filter`]: column.filter,
				[`${classNamePrefix}-column-hidden`]: (fixed === "left" && column.fixed !== "left") || (fixed === "right" && column.fixed !== "right") || (!fixed && (column.fixed === "left" || column.fixed === "right"))
			};
		},
		getCollapsionTdClasses(rowCollapsion) {
			let classNamePrefix = this.classNamePrefix;
			let className = rowCollapsion.className;
			let align = rowCollapsion.align || "center";

			return {
				[`${className}`]: className,
				[`${classNamePrefix}-column-align-${align}`]: align,
				[`${classNamePrefix}-column-with-collapsion`]: true
			};
		},
		getSelectionTdClasses(rowSelection) {
			let classNamePrefix = this.classNamePrefix;
			let className = rowSelection.className;
			let align = rowSelection.align || "center";

			return {
				[`${className}`]: className,
				[`${classNamePrefix}-column-align-${align}`]: align,
				[`${classNamePrefix}-column-with-selection`]: true
			};
		},

		handleRowMouseenter(row, rowKey) {
			this.vuiTable.handleRowMouseenter(row, rowKey);
		},
		handleRowMouseleave(row, rowKey) {
			this.vuiTable.handleRowMouseleave(row, rowKey);
		},
		handleRowClick(row, rowKey) {
			this.vuiTable.handleRowClick(row, rowKey);

			if (this.rowCollapsion && this.rowCollapsion.clickRowToCollapse) {
				this.vuiTable.handleRowCollapse(row, rowKey);
			}
		},
		handleRowCollapse(row, rowKey) {
			if (this.rowCollapsion && !this.rowCollapsion.clickRowToCollapse) {
				this.vuiTable.handleRowCollapse(row, rowKey);
			}
		},
		handleRowSelect(checked, row, rowKey) {
			this.vuiTable.handleRowSelect(checked, row, rowKey);
		},

		drawColgroupChildren(h) {
			let { rowCollapsion, rowSelection, store, getTdKey } = this;
			let children = [];

			if (rowCollapsion) {
				children.push(
					<col width={rowCollapsion.width || 50} />
				);
			}

			if (rowSelection) {
				children.push(
					<col width={rowSelection.width || 50} />
				);
			}

			store.colgroup.forEach((column, columnIndex) => {
				children.push(
					<col key={getTdKey(column, columnIndex)} width={column.width} />
				);
			});

			return children;
		},
		drawTbodyChildren(h) {
			let { vuiTable, rowCollapsion, rowSelection, locale, store, classes, emptyText, isRowCollapsed, isRowSelected, getTrKey, getTrClasses, getCollapsionTrClasses, getTdKey, getTdClasses, getCollapsionTdClasses, getSelectionTdClasses } = this;
			let { handleRowMouseenter, handleRowMouseleave, handleRowClick, handleRowCollapse, handleRowSelect } = this;
			let children = [];

			if (store.tbody.length === 0) {
				let colspan = 0;

				if (rowCollapsion) {
					colspan++;
				}

				if (rowSelection) {
					colspan++;
				}

				colspan += store.colgroup.length;

				return (
					<tr>
						<td colspan={colspan}>
							<VuiEmpty description={emptyText} style="padding: 30px 0;" />
						</td>
					</tr>
				);
			}

			store.tbody.forEach((row, rowIndex) => {
				let rowKey = getTrKey(row, rowIndex);
				let tds = [];

				if (rowCollapsion) {
					let isCollapsed = isRowCollapsed(rowKey);
					let tag = isCollapsed ? "&minus;" : "&plus;";

					tds.push(
						<td class={getCollapsionTdClasses(rowCollapsion)}>
							<i class={classes.elColumnCollapsion} onClick={() => handleRowCollapse(row, rowKey)} domPropsInnerHTML={tag}></i>
						</td>
					);
				}

				if (rowSelection) {
					let isSelected = isRowSelected(rowKey);
					let component;
					let options = {};

					if (rowSelection.getComponentProps) {
						options.props = rowSelection.getComponentProps(clone(row));
					}

					if (!("multiple" in rowSelection) || rowSelection.multiple) {
						component = (
							<VuiCheckbox {...options} class={classes.elColumnSelection} checked={isSelected} onChange={checked => handleRowSelect(checked, row, rowKey)} />
						);
					}
					else {
						component = (
							<VuiRadio {...options} class={classes.elColumnSelection} checked={isSelected} onChange={checked => handleRowSelect(checked, row, rowKey)} />
						);
					}

					tds.push(
						<td class={getSelectionTdClasses(rowSelection)}>
							{component}
						</td>
					);
				}

				store.colgroup.forEach((column, columnIndex) => {
					let columnKey = getTdKey(column, columnIndex);
					let content;

					if (column.slot) {
						let scopedSlot = vuiTable.$scopedSlots[column.slot];

						content = scopedSlot && scopedSlot({
							column: clone(column),
							row: clone(row),
							index: rowIndex
						});
					}
					else if (column.render) {
						content = column.render(h, {
							column: clone(column),
							row: clone(row),
							index: rowIndex
						});
					}
					else {
						content = row[column.dataIndex];
					}

					tds.push(
						<td key={columnKey} class={getTdClasses(row, column, columnKey)}>
							{content}
						</td>
					);
				});

				children.push(
					<tr key={rowKey} class={getTrClasses(row, rowIndex, rowKey)} onMouseenter={() => handleRowMouseenter(row, rowKey)} onMouseleave={() => handleRowMouseleave(row, rowKey)} onClick={() => handleRowClick(row, rowKey)}>
						{tds}
					</tr>
				);

				if (rowCollapsion && isRowCollapsed(rowKey)) {
					children.push(
						<tr class={getCollapsionTrClasses()}>
							<td></td>
							<td colspan={store.colgroup.length}>
								{rowCollapsion.render && rowCollapsion.render(h, clone(row))}
							</td>
						</tr>
					);
				}
			});

			return children;
		}
	},

	render(h) {
		let { styles, drawColgroupChildren, drawTbodyChildren } = this;

		return (
			<table border="0" cellpadding="0" cellspacing="0" style={styles.el}>
				<colgroup>
					{this.drawColgroupChildren(h)}
				</colgroup>
				<tbody>
					{this.drawTbodyChildren(h)}
				</tbody>
			</table>
		);
	}
};

export default VuiTableTbody;
