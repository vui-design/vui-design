import VuiCheckbox from "vui-design/components/checkbox";
import VuiTableFilter from "./filter";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";

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
		rowCollapsion: {
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
		collapsedRowKeys: {
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
			let { $props: props } = this;
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
			let { $props: props } = this;
			let maybeShowColumn = this.maybeShowColumn(column);
			let boolean = false;

			if (column.sorter && maybeShowColumn) {
				boolean = true;
			}

			return boolean;
		},
		maybeShowColumnFilter(column) {
			let { $props: props } = this;
			let maybeShowColumn = this.maybeShowColumn(column);
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

			let { $props: props } = this;
			let ellipsis = column.ellipsis;
			let align = column.align || "center";
			let className = column.className;

			if (type === "collapsion") {
				return {
					[`${props.classNamePrefix}-column-with-collapsion`]: true,
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
				let maybeShowColumn = this.maybeShowColumn(column);
				let maybeShowColumnSorter = this.maybeShowColumnSorter(column);
				let maybeShowColumnFilter = this.maybeShowColumnFilter(column);

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
			let { $props: props } = this;

			return {
				[`${props.classNamePrefix}-column-title`]: true
			};
		},
		getColumnSorterClassName(column) {
			let { $props: props } = this;

			return {
				[`${props.classNamePrefix}-column-sorter`]: true
			};
		},
		getColumnSorterCaretClassName(type, column) {
			let { $props: props } = this;

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
		renderColgroupChildren(h) {
			let { $props: props } = this;
			let children = [];

			if (props.rowCollapsion) {
				let { width = 50 } = props.rowCollapsion;

				children.push(
					<col key="collapsion" width={width} />
				);
			}

			if (props.rowSelection) {
				let { width = 50 } = props.rowSelection;

				children.push(
					<col key="selection" width={width} />
				);
			}

			props.colgroup.forEach((column, columnIndex) => {
				children.push(
					<col key={column.key || columnIndex} width={column.width} />
				);
			});

			return children;
		},
		renderTheadChildren(h) {
			let { $props: props } = this;
			let children = [];

			props.thead.forEach((row, rowIndex) => {
				let ths = [];

				if (props.rowCollapsion && rowIndex === 0) {
					ths.push(
						<th
							key="collapsion"
							colspan="1"
							rowspan={props.thead.length}
							class={this.getColumnClassName("collapsion", props.rowCollapsion)}
						>
							{props.rowCollapsion.title}
						</th>
					);
				}

				if (props.rowSelection && rowIndex === 0) {
					let component;
					let isCustomizedMultiple = "multiple" in props.rowSelection;
					let isMultiple = !isCustomizedMultiple || props.rowSelection.multiple;

					if (props.rowSelection.title) {
						component = (
							<div class={this.getColumnTitleClassName(props.rowSelection)}>
								{props.rowSelection.title}
							</div>
						);
					}
					else if (isMultiple) {
						let rowLength = 0;
						let selectedLength = 0;

						props.tbody.forEach((data, dataIndex) => {
							let dataKey;
							let attributes;

							if (is.string(props.rowKey)) {
								dataKey = data[props.rowKey];
							}
							else if (is.function(props.rowKey)) {
								dataKey = props.rowKey(clone(data), dataIndex);
							}
							else {
								dataKey = dataIndex;
							}

							if (is.function(props.rowSelection.getComponentProps)) {
								attributes = props.rowSelection.getComponentProps(clone(data), dataIndex, dataKey);
							}

							if (!attributes || !attributes.disabled) {
								rowLength++;

								if (props.selectedRowKeys.indexOf(dataKey) > -1) {
									selectedLength++;
								}
							}
						});

						let indeterminate = !!selectedLength && (selectedLength < rowLength);
						let checked = selectedLength === rowLength;

						component = (
							<VuiCheckbox
								indeterminate={indeterminate}
								checked={checked}
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

				children.push(
					<tr key={rowIndex}>
						{ths}
					</tr>
				);
			});

			return children;
		}
	},

	render(h) {
		let { $props: props, renderColgroupChildren, renderTheadChildren } = this;
		let styles = {
			el: {
				width: props.scroll && props.scroll.x > 0 ? `${props.scroll.x}px` : `100%`
			}
		};

		return (
			<table border="0" cellpadding="0" cellspacing="0" style={styles.el}>
				<colgroup>
					{renderColgroupChildren(h)}
				</colgroup>
				<thead>
					{renderTheadChildren(h)}
				</thead>
			</table>
		);
	}
};

export default VuiTableThead;