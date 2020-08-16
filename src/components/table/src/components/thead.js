import VuiCheckbox from "vui-design/components/checkbox";
import VuiTableFilter from "./filter";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import flatten from "vui-design/utils/flatten";
import getTargetByPath from "vui-design/utils/getTargetByPath";
import utils from "../utils";

const VuiTableThead = {
	name: "vui-table-thead",

	inject: {
		vuiTable: {
			default: undefined
		}
	},

	components: {
		VuiCheckbox,
		VuiTableFilter
	},

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
				const maybeShowColumn = this.maybeShowColumn(column);
				const maybeShowColumnSorter = this.maybeShowColumnSorter(column);
				const maybeShowColumnFilter = this.maybeShowColumnFilter(column);

				return {
					[`${props.classNamePrefix}-column-hidden`]: !maybeShowColumn,
					[`${props.classNamePrefix}-column-with-sorter`]: maybeShowColumnSorter,
					[`${props.classNamePrefix}-column-with-filter`]: maybeShowColumnFilter,
					[`${props.classNamePrefix}-column-ellipsis`]: ellipsis,
					[`${props.classNamePrefix}-column-align-${align}`]: align,
					[`${className}`]: className
				};
			}
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
				[`${props.classNamePrefix}-column-selected`]: checked
			};
		},
		getColumnSorterClassName(column) {
			const { $props: props } = this;

			return {
				[`${props.classNamePrefix}-column-sorter`]: true
			};
		},
		getColumnSorterCaretClassName(type, column) {
			const { $props: props } = this;

			return {
				[`${props.classNamePrefix}-column-sorter-caret`]: true,
				[`${props.classNamePrefix}-column-sorter-caret-${type}`]: true,
				[`on`]: column.sorter.order === type
			};
		},
		handleSelectAll(checked) {
			this.vuiTable.handleSelectAll(checked);
		},
		handleFilter(column, value) {
			if (!column.filter) {
				return;
			}

			this.vuiTable.handleFilter(clone(column), value);
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
				cols.push(
					<col key={column.key || columnIndex} width={column.width} />
				);
			});
		},
		getThead(h) {
			const { $props: props } = this;
			let trs = [];

			this.gatherTheadChildren(h, trs, props.thead);

			return (
				<thead>{trs}</thead>
			);
		},
		gatherTheadChildren(h, trs, rows) {
			const { $props: props } = this;

			rows.forEach((row, rowIndex) => {
				let ths = [];

				if (props.rowExpansion && rowIndex === 0) {
					ths.push(
						<th
							key="expansion"
							colspan="1"
							rowspan={props.thead.length}
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
						let rows = [];

						if (props.rowTreeview) {
							const property = props.rowTreeview.children || "children";

							rows = flatten(props.tbody, property, true);
						}
						else {
							rows = props.tbody;
						}

						const status = utils.getSelectionComponentStatus(rows, {
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
								onChange={this.handleSelectAll}
							/>
						);
					}

					ths.push(
						<th
							key="selection"
							colspan="1"
							rowspan={props.thead.length}
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

					let content = [];

					content.push(
						<div class={this.getColumnTitleClassName(column)}>
							{is.function(column.title) ? column.title(h, clone(column), columnIndex) : column.title}
						</div>
					);

					if (this.maybeShowColumnSorter(column)) {
						content.push(
							<div class={this.getColumnSorterClassName(column)}>
								<i class={this.getColumnSorterCaretClassName("asc", column)}></i>
								<i class={this.getColumnSorterCaretClassName("desc", column)}></i>
							</div>
						);
					}

					if (this.maybeShowColumnFilter(column)) {
						content.push(
							<VuiTableFilter
								classNamePrefix={props.classNamePrefix}
								options={column.filter.options}
								multiple={column.filter.multiple}
								value={column.filter.value}
								locale={props.locale}
								onChange={value => this.handleFilter(column, value)}
							/>
						);
					}

					ths.push(
						<th
							key={column.key || columnIndex}
							colspan={column.colSpan}
							rowspan={column.rowSpan}
							class={this.getColumnClassName(column)}
							onClick={() => this.handleSort(column)}
						>
							{content}
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