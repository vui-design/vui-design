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
		scroll: {
			type: Object,
			default: undefined
		},
		getRowKey: {
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

			classes.elColumnTitle = `${classNamePrefix}-column-title`;
			classes.elColumnSorter = `${classNamePrefix}-column-sorter`;

			return classes;
		}
	},

	methods: {
		needRenderSorter(column) {
			let fixed = this.fixed;

			return column.sorter && ((!fixed && !column.fixed) || (fixed === "left" && column.fixed === "left") || (fixed === "right" && column.fixed === "right"));
		},
		needRenderFilter(column) {
			let fixed = this.fixed;

			return column.filter && ((!fixed && !column.fixed) || (fixed === "left" && column.fixed === "left") || (fixed === "right" && column.fixed === "right"));
		},
		getThKey(column, columnIndex) {
			let key;

			if ("key" in column) {
				key = column.key;
			}
			else if (column.dataIndex) {
				key = column.dataIndex;
			}
			else {
				key = columnIndex;
			}

			return key;
		},
		getThClasses(column) {
			let classNamePrefix = this.classNamePrefix;
			let fixed = this.fixed;
			let needRenderSorter = this.needRenderSorter(column);
			let needRenderFilter = this.needRenderFilter(column);
			let needHidden = (fixed === "left" && column.fixed !== "left") || (fixed === "right" && column.fixed !== "right") || (!fixed && (column.fixed === "left" || column.fixed === "right"));

			return {
				[`${column.className}`]: column.className,
				[`${classNamePrefix}-column-align-${column.align}`]: column.align,
				[`${classNamePrefix}-column-ellipsis`]: column.ellipsis,
				[`${classNamePrefix}-column-with-sorter`]: needRenderSorter,
				[`${classNamePrefix}-column-with-filter`]: needRenderFilter,
				[`${classNamePrefix}-column-hidden`]: needHidden
			};
		},
		getCollapsionThClasses(rowCollapsion) {
			let classNamePrefix = this.classNamePrefix;
			let className = rowCollapsion.className;
			let align = rowCollapsion.align || "center";

			return {
				[`${className}`]: className,
				[`${classNamePrefix}-column-align-${align}`]: align,
				[`${classNamePrefix}-column-with-collapsion`]: true
			};
		},
		getSelectionThClasses(rowSelection) {
			let classNamePrefix = this.classNamePrefix;
			let className = rowSelection.className;
			let align = rowSelection.align || "center";

			return {
				[`${className}`]: className,
				[`${classNamePrefix}-column-align-${align}`]: align,
				[`${classNamePrefix}-column-with-selection`]: true
			};
		},
		getSorterCaretClasses(column, order) {
			let classNamePrefix = this.classNamePrefix;
			let state =  column.sorter.order === order ? "on" : "off";

			return {
				[`${classNamePrefix}-column-sorter-caret`]: true,
				[`${classNamePrefix}-column-sorter-caret-${order}`]: true,
				[`${state}`]: state
			};
		},

		handleSelectAll(checked) {
			this.vuiTable.handleSelectAll(checked);
		},
		handleSorter(column) {
			if (!column.sorter) {
				return;
			}

			let order = column.sorter.order;

			if (order === "normal") {
				order = "asc";
			}
			else if (order === "asc") {
				order = "desc";
			}
			else if (order === "desc") {
				order = "normal";
			}

			this.vuiTable.handleSorter(clone(column), order);
		},
		handleFilter(column, value) {
			this.vuiTable.handleFilter(clone(column), value);
		},

		drawColgroupChildren(h) {
			let { rowCollapsion, rowSelection, store, getThKey } = this;
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
					<col key={getThKey(column, columnIndex)} width={column.width} />
				);
			});

			return children;
		},
		drawTheadChildren(h) {
			let { classNamePrefix, getRowKey, rowCollapsion, rowSelection, locale, store, classes, needRenderSorter, needRenderFilter, getThKey, getThClasses, getCollapsionThClasses, getSelectionThClasses, getSorterCaretClasses } = this;
			let { handleSelectAll, handleSorter, handleFilter } = this;
			let children = [];

			store.thead.forEach((row, rowIndex) => {
				let ths = [];

				if (rowIndex === 0 && rowCollapsion) {
					ths.push(
						<th colspan={1} rowspan={store.thead.length} class={getCollapsionThClasses(rowCollapsion)}>
							{rowCollapsion.title}
						</th>
					);
				}

				if (rowIndex === 0 && rowSelection) {
					let component;

					if (rowSelection.title) {
						component = (
							<div class={classes.elColumnTitle}>
								{rowSelection.title}
							</div>
						);
					}
					else if (!("multiple" in rowSelection) || rowSelection.multiple) {
						let theRowLength = 0;
						let theSelectedLength = 0;

						store.tbody.forEach((data, dataIndex) => {
							let key;
							let props;

							if (is.string(getRowKey)) {
								key = data[getRowKey];
							}
							else if (is.function(getRowKey)) {
								key = getRowKey(data);
							}
							else {
								key = dataIndex;
							}

							if (is.function(this.rowSelection.getComponentProps)) {
								props = this.rowSelection.getComponentProps(clone(data));
							}

							if (!props || !props.disabled) {
								theRowLength++;

								if (store.rowSelectionState.indexOf(key) > -1) {
									theSelectedLength++;
								}
							}
						});

						let indeterminate = !!theSelectedLength && (theSelectedLength < theRowLength);
						let checked = theSelectedLength === theRowLength;

						component = (
							<VuiCheckbox indeterminate={indeterminate} checked={checked} onChange={handleSelectAll} />
						);
					}

					ths.push(
						<th colspan={1} rowspan={store.thead.length} class={getSelectionThClasses(rowSelection)}>
							{component}
						</th>
					);
				}

				row.forEach((column, columnIndex) => {
					let columnKey = getThKey(column, columnIndex);
					let content = [];

					content.push(
						<div class={classes.elColumnTitle}>
							{is.function(column.title) ? column.title(h, clone(column)) : column.title}
						</div>
					);

					if (needRenderSorter(column)) {
						content.push(
							<div class={classes.elColumnSorter}>
								<i class={getSorterCaretClasses(column, "asc")}></i>
								<i class={getSorterCaretClasses(column, "desc")}></i>
							</div>
						);
					}

					if (needRenderFilter(column)) {
						content.push(
							<VuiTableFilter classNamePrefix={classNamePrefix} options={column.filter.options} multiple={column.filter.multiple} value={column.filter.value} locale={locale} onChange={value => handleFilter(column, value)} />
						);
					}

					ths.push(
						<th key={columnKey} colspan={column.colSpan} rowspan={column.rowSpan} class={getThClasses(column)} onClick={() => handleSorter(column)}>
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
		let { styles, drawColgroupChildren, drawTheadChildren } = this;

		return (
			<table border="0" cellpadding="0" cellspacing="0" style={styles.el}>
				<colgroup>
					{this.drawColgroupChildren(h)}
				</colgroup>
				<thead>
					{this.drawTheadChildren(h)}
				</thead>
			</table>
		);
	}
};

export default VuiTableThead;
