import VuiSpin from "vui-design/components/spin";
import VuiTableThead from "./components/thead";
import VuiTableTbody from "./components/tbody";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import getScrollBarSize from "vui-design/utils/getScrollBarSize";
import { getFlattenColumns, mapColumnsToState, mapDataToState } from "./utils/index";

const VuiTable = {
	name: "vui-table",

	provide() {
		return {
			vuiTable: this
		};
	},

	components: {
		VuiSpin,
		VuiTableThead,
		VuiTableTbody
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-table"
		},
		columns: {
			type: Array,
			default: () => []
		},
		data: {
			type: Array,
			default: () => []
		},
		rowCollapsion: {
			type: Object,
			default: undefined
		},
		rowSelection: {
			type: Object,
			default: undefined
		},
		showHeader: {
			type: Boolean,
			default: true
		},
		bordered: {
			type: Boolean,
			default: false
		},
		striped: {
			type: Boolean,
			default: false
		},
		scroll: {
			type: Object,
			default: undefined
		},
		size: {
			type: String,
			default() {
				return (this.$vui || {}).size || undefined;
			},
			validator(value) {
				return ["large", "small"].indexOf(value) !== -1;
			}
		},
		loading: {
			type: Boolean,
			default: false
		},
		getRowKey: {
			type: [String, Function],
			default: "key"
		},
		getRowClassName: {
			type: [String, Function],
			default: undefined
		},
		pagination: {
			type: Object,
			default: undefined
		},
		locale: {
			type: Object,
			default: undefined
		}
	},

	data() {
		const store = {
			columns: [],
			data: [],
			colgroup: [],
			thead: [],
			tbody: [],
			rowCollapsionState: undefined,
			rowSelectionState: undefined,
			rowHoverionState: undefined
		};

		return { store };
	},

	computed: {
		classes() {
			let { classNamePrefix, bordered, striped } = this;
			let classes = {};

			classes.el = {
				[`${classNamePrefix}-wrapper`]: true,
				[`${classNamePrefix}-wrapper-bordered`]: bordered
			};
			classes.elTable = {
				[`${classNamePrefix}`]: true,
				[`${classNamePrefix}-bordered`]: bordered,
				[`${classNamePrefix}-striped`]: striped
			};

			return classes;
		},
		showLeftTable() {
			return this.columns.some(column => column.fixed === "left");
		},
		showRightTable() {
			return this.columns.some(column => column.fixed === "right");
		},
		showXScrollbar() {
			return this.scroll && this.scroll.x > 0;
		},
		showYScrollbar() {
			return this.scroll && this.scroll.y > 0;
		}
	},

	watch: {
		columns(value) {
			let columns = mapColumnsToState(value);

			this.store.columns = columns;
			this.store.colgroup = this.getColgroupData(this.store.columns);
			this.store.thead = this.getTheadData(this.store.columns);
			this.store.tbody = this.getTbodyData(this.store.data);
		},
		data(value) {
			let data = mapDataToState(value);

			this.store.data = data;
			this.store.tbody = this.getTbodyData(this.store.data);
		},
		rowCollapsion(value) {
			let rowCollapsionState;

			if (value) {
				rowCollapsionState = value.value ? clone(value.value) : [];
			}

			this.rowCollapsionState = rowCollapsionState;
		},
		rowSelection(value) {
			let rowSelectionState;

			if (value) {
				if (!("multiple" in value) || value.multiple) {
					rowSelectionState = value.value ? clone(value.value) : [];
				}
				else {
					rowSelectionState = value.value ? value.value : undefined;
				}
			}

			this.rowSelectionState = rowSelectionState;
		}
	},

	methods: {
		// 获取表格的 colgroup 数据，用于设置列宽
		getColgroupData(columns) {
			return getFlattenColumns(columns);
		},
		// 获取表格的 thead 数据，用于渲染表头
		getTheadData(columns) {
			let max = 1;
			let traverse = (column, parent) => {
				if (parent) {
					column.level = parent.level + 1;

					if (max < column.level) {
						max = column.level;
					}
				}

				if (column.children) {
					let colSpan = 0;

					column.children.forEach(child => {
						traverse(child, column);
						colSpan += child.colSpan;
					});

					column.colSpan = colSpan;
				}
				else {
					column.colSpan = 1;
				}
			};

			columns.forEach((column) => {
				column.level = 1;
				traverse(column);
			});

			var rows = [];

			for (var i = 0; i < max; i++) {
				rows.push([]);
			}

			const flattenColumns = getFlattenColumns(columns, true);

			flattenColumns.forEach((column) => {
				if (column.children) {
					column.rowSpan = 1;
				}
				else {
					column.rowSpan = max - column.level + 1;
				}

				rows[column.level - 1].push(column);
			});

			return rows;
		},
		// 获取表格的 tbody 数据，用于渲染表格
		getTbodyData(data) {
			let result = clone(data);

			result = this.getDataBySorter(result);
			result = this.getDataByFilter(result);

			return result;
		},

		// 更新排序列的状态
		setSorterColumnState(columns, key, order) {
			columns = getFlattenColumns(columns, true);

			columns.forEach(column => {
				if (column.sorter) {
					if (column.key === key) {
						column.sorter.order = order;
					}
					else {
						column.sorter.order = "normal";
					}
				}
			});
		},
		// 更新筛选列的状态
		setFilterColumnState(columns, key, value) {
			columns = getFlattenColumns(columns, true);

			columns.forEach(column => {
				if (column.key === key && column.filter) {
					column.filter.value = value;
				}
			});
		},

		// 对 rawDataSource 数据进行排序
		sorterDataSource(dataSource, column) {
			let { dataIndex, sorter } = column;

			dataSource.sort((a, b) => {
				if (sorter.method) {
					return sorter.method(a[dataIndex], b[dataIndex], sorter.order);
				}
				else {
					if (sorter.order === "asc") {
						return a[dataIndex] > b[dataIndex] ? 1 : -1;
					}
					else if (sorter.order === "desc") {
						return a[dataIndex] < b[dataIndex] ? 1 : -1;
					}
					else {
						return 0;
					}
				}
			});

			return dataSource;
		},
		// 按排序方式重新生成 tbody 数据
		getDataBySorter(dataSource) {
			const columns = getFlattenColumns(this.store.columns);

			columns.forEach(column => {
				if (column.sorter && column.sorter.order !== "normal" && !column.sorter.server) {
					dataSource = this.sorterDataSource(dataSource, column);
				}
			});

			return dataSource;
		},

		// 对 rawDataSource 数据进行过滤
		filterDataSource(dataSource, column) {
			let { dataIndex, filter } = column;

			return dataSource.filter(row => {
				return filter.method(filter.value, clone(row));
			});
		},
		// 按筛选条件重新生成 tbody 数据
		getDataByFilter(dataSource) {
			const columns = getFlattenColumns(this.store.columns);

			columns.forEach(column => {
				if (column.filter && column.filter.value && !column.filter.server) {
					dataSource = this.filterDataSource(dataSource, column);
				}
			});

			return dataSource;
		},

		// 同步横向滚动位置
		setScrollXPosition(e) {
			if (e.currentTarget !== e.target) {
				return;
			}

			let target = e.target;
			let scrollLeft = target.scrollLeft;
			let { table, fixedMiddleHeaderScrollbar, fixedMiddleBodyScrollbar } = this.$refs;

			if (scrollLeft !== this.lastScrollLeft) {
				if (target === fixedMiddleHeaderScrollbar && fixedMiddleBodyScrollbar) {
					fixedMiddleBodyScrollbar.scrollLeft = scrollLeft;
				}

				if (target === fixedMiddleBodyScrollbar && fixedMiddleHeaderScrollbar) {
					fixedMiddleHeaderScrollbar.scrollLeft = scrollLeft;
				}
			}

			this.lastScrollLeft = scrollLeft;
		},
		// 同步纵向滚动位置
		setScrollYPosition(e) {
			if (e.currentTarget !== e.target) {
				return;
			}

			const target = e.target;
			const scrollTop = target.scrollTop;
			const { fixedLeftBodyScrollbar, fixedMiddleBodyScrollbar, fixedRightBodyScrollbar } = this.$refs;

			if (scrollTop !== this.lastScrollTop) {
				if (fixedLeftBodyScrollbar && target !== fixedLeftBodyScrollbar) {
					fixedLeftBodyScrollbar.scrollTop = scrollTop;
				}

				if (fixedMiddleBodyScrollbar && target !== fixedMiddleBodyScrollbar) {
					fixedMiddleBodyScrollbar.scrollTop = scrollTop;
				}


				if (fixedRightBodyScrollbar && target !== fixedRightBodyScrollbar) {
					fixedRightBodyScrollbar.scrollTop = scrollTop;
				}
			}

			this.lastScrollTop = scrollTop; 
		},

		// 滚动事件回调函数
		handleScroll(e) {
			this.setScrollXPosition(e);
			this.setScrollYPosition(e);
		},
		// 行鼠标移入事件回调函数
		handleRowMouseenter(row, key) {
			this.store.rowHoverionState = key;
			this.$emit("mouseenter", row, key);
		},
		// 行鼠标移出事件回调函数
		handleRowMouseleave(row, key) {
			this.store.rowHoverionState = undefined;
			this.$emit("mouseleave", row, key);
		},
		// 行点击事件回调函数
		handleRowClick(row, key) {
			this.$emit("click", row, key);
		},
		// 展开事件回调函数
		handleRowCollapse(row, key) {
			if (!this.rowCollapsion) {
				return;
			}

			if (this.store.rowCollapsionState.indexOf(key) === -1) {
				this.store.rowCollapsionState.push(key);
			}
			else {
				this.store.rowCollapsionState.splice(this.store.rowCollapsionState.indexOf(key), 1);
			}

			this.$emit("collapse", clone(this.store.rowCollapsionState));
		},
		// 选择事件回调函数
		handleRowSelect(checked, row, key) {
			if (!this.rowSelection) {
				return;
			}

			if (!("multiple" in this.rowSelection) || this.rowSelection.multiple) {
				if (checked) {
					this.store.rowSelectionState.push(key);
				}
				else {
					this.store.rowSelectionState.splice(this.store.rowSelectionState.indexOf(key), 1);
				}
			}
			else {
				if (checked) {
					this.store.rowSelectionState = key;
				}
			}

			this.$emit("select", clone(this.store.rowSelectionState));
		},
		// 全选&取消全选事件回调函数
		handleSelectAll(checked) {
			// 以下两种情况返回不处理
			// 1、未启用行选择功能
			// 2、已启用行选择功能，但是使用单选模式
			if (!this.rowSelection || (("multiple") in this.rowSelection && this.rowSelection.multiple === false)) {
				return;
			}

			// checked 为 true 时执行全选操作
			if (checked) {
				let rowSelectionState = clone(this.store.rowSelectionState);

				this.store.tbody.forEach((row, rowIndex) => {
					let getRowKey = this.getRowKey;
					let key;
					let props;

					if (is.string(getRowKey)) {
						key = row[getRowKey];
					}
					else if (is.function(getRowKey)) {
						key = getRowKey(row);
					}
					else {
						key = rowIndex;
					}

					if (is.function(this.rowSelection.getComponentProps)) {
						props = this.rowSelection.getComponentProps(clone(row));
					}

					if (rowSelectionState.indexOf(key) > -1 || (props && props.disabled)) {

					}
					else {
						rowSelectionState.push(key);
					}
				});

				this.store.rowSelectionState = rowSelectionState;
			}
			// 反之，执行取消全选操作
			else {
				let rowSelectionState = clone(this.store.rowSelectionState);

				this.store.tbody.forEach((row, rowIndex) => {
					let getRowKey = this.getRowKey;
					let key;
					let props;

					if (is.string(getRowKey)) {
						key = row[getRowKey];
					}
					else if (is.function(getRowKey)) {
						key = getRowKey(row);
					}
					else {
						key = rowIndex;
					}

					if (is.function(this.rowSelection.getComponentProps)) {
						props = this.rowSelection.getComponentProps(clone(row));
					}

					if (rowSelectionState.indexOf(key) === -1 || (props && props.disabled)) {

					}
					else {
						rowSelectionState.splice(rowSelectionState.indexOf(key), 1);
					}
				});

				this.store.rowSelectionState = rowSelectionState;
			}

			this.$emit("select", clone(this.store.rowSelectionState));
		},
		// 排序事件回调函数
		handleSorter(column, order) {
			if (!column.sorter) {
				return;
			}

			this.setSorterColumnState(this.store.columns, column.key, order);

			if (!column.sorter.server) {
				this.store.tbody = this.getTbodyData(this.store.data);
			}

			this.$emit("sorter", clone(column), order);
		},
		// 筛选事件回调函数
		handleFilter(column, value) {
			if (!column.filter) {
				return;
			}

			this.setFilterColumnState(this.store.columns, column.key, value);

			if (!column.filter.server) {
				this.store.tbody = this.getTbodyData(this.store.data);
			}

			this.$emit("filter", clone(column), value);
		},

		// 绘制左固定表格
		drawLeftTable() {
			if (!this.showLeftTable) {
				return;
			}

			let header;
			let body;

			// 计算 style 样式
			let width = this.store.colgroup.filter(column => column.fixed === "left").reduce((sum, column) => (sum + column.width), 0);
			let styles = {
				table: {
					width: width + "px"
				},
				tableBodyScrollbar: {}
			};

			if (this.showYScrollbar) {
				styles.tableBodyScrollbar.width = (width + getScrollBarSize()) + "px";

				if (this.showXScrollbar) {
					styles.tableBodyScrollbar.maxHeight = (this.scroll.y - getScrollBarSize()) + "px";
				}
				else {
					styles.tableBodyScrollbar.maxHeight = this.scroll.y + "px";
				}

				styles.tableBodyScrollbar.overflowY = "scroll";
			}
			else {
				styles.tableBodyScrollbar.width = width + "px";
			}

			// 计算 class 样式
			let classes = {
				table: {
					[`${this.classNamePrefix}-left`]: true
				},
				tableHeader: `${this.classNamePrefix}-header`,
				tableHeaderScrollbar: `${this.classNamePrefix}-header-scrollbar`,
				tableBody: `${this.classNamePrefix}-body`,
				tableBodyScrollbar: `${this.classNamePrefix}-body-scrollbar`
			};

			// 是否显示表头
			if (this.showHeader) {
				header = (
					<div ref="fixedLeftHeader" class={classes.tableHeader}>
						<div ref="fixedLeftHeaderScrollbar" class={classes.tableHeaderScrollbar}>
							<VuiTableThead
								fixed="left"
								classNamePrefix={this.classNamePrefix}
								scroll={this.scroll}
								getRowKey={this.getRowKey}
								rowCollapsion={this.rowCollapsion}
								rowSelection={this.rowSelection}
								locale={this.locale}
								store={this.store}
							/>
						</div>
					</div>
				);
			}

			// 表格内容
			body = (
				<div ref="fixedLeftBody" class={classes.tableBody}>
					<div ref="fixedLeftBodyScrollbar" style={styles.tableBodyScrollbar} class={classes.tableBodyScrollbar} onScroll={this.handleScroll}>
						<VuiTableTbody
							classNamePrefix={this.classNamePrefix}
							fixed={"left"}
							scroll={this.scroll}
							getRowKey={this.getRowKey}
							getRowClassName={this.getRowClassName}
							rowCollapsion={this.rowCollapsion}
							rowSelection={this.rowSelection}
							locale={this.locale}
							store={this.store}
						/>
					</div>
				</div>
			);

			return (
				<div class={classes.table} style={styles.table}>
					{header}
					{body}
				</div>
			);
		},
		// 绘制中间表格
		drawMiddleTable() {
			let header;
			let body;

			// 计算 style 样式
			let styles = {
				tableHeaderScrollbar: {},
				tableBodyScrollbar: {}
			};

			if (this.showXScrollbar) {
				styles.tableBodyScrollbar.overflowX = "scroll";
			}

			if (this.showYScrollbar) {
				styles.tableHeaderScrollbar.overflowY = "scroll";
				styles.tableBodyScrollbar.maxHeight = this.scroll.y + "px";
				styles.tableBodyScrollbar.overflowY = "scroll";
			}

			// 计算 class 样式
			let classes = {
				table: {
					[`${this.classNamePrefix}-middle`]: true
				},
				tableHeader: `${this.classNamePrefix}-header`,
				tableHeaderScrollbar: `${this.classNamePrefix}-header-scrollbar`,
				tableBody: `${this.classNamePrefix}-body`,
				tableBodyScrollbar: `${this.classNamePrefix}-body-scrollbar`
			};

			// 是否显示表头
			if (this.showHeader) {
				header = (
					<div ref="fixedMiddleHeader" class={classes.tableHeader}>
						<div ref="fixedMiddleHeaderScrollbar" style={styles.tableHeaderScrollbar} class={classes.tableHeaderScrollbar}>
							<VuiTableThead
								classNamePrefix={this.classNamePrefix}
								scroll={this.scroll}
								getRowKey={this.getRowKey}
								rowCollapsion={this.rowCollapsion}
								rowSelection={this.rowSelection}
								locale={this.locale}
								store={this.store}
							/>
						</div>
					</div>
				);
			}

			// 表格内容
			body = (
				<div ref="fixedMiddleBody" class={classes.tableBody}>
					<div ref="fixedMiddleBodyScrollbar" class={classes.tableBodyScrollbar} style={styles.tableBodyScrollbar} onScroll={this.handleScroll}>
						<VuiTableTbody
							classNamePrefix={this.classNamePrefix}
							scroll={this.scroll}
							getRowKey={this.getRowKey}
							getRowClassName={this.getRowClassName}
							rowCollapsion={this.rowCollapsion}
							rowSelection={this.rowSelection}
							locale={this.locale}
							store={this.store}
						/>
					</div>
				</div>
			);

			return (
				<div class={classes.table}>
					{header}
					{body}
				</div>
			);
		},
		// 绘制右固定表格
		drawRightTable() {
			if (!this.showRightTable) {
				return;
			}

			let header;
			let body;

			// 计算 style 样式
			let width = this.store.colgroup.filter(column => column.fixed === "right").reduce((sum, column) => (sum + column.width), 0);
			let styles = {
				table: {
					width: width + "px"
				},
				tableBodyScrollbar: {}
			};

			if (this.showYScrollbar) {
				styles.table.right = getScrollBarSize() + "px";
				styles.tableBodyScrollbar.width = (width + getScrollBarSize()) + "px";

				if (this.showXScrollbar) {
					styles.tableBodyScrollbar.maxHeight = (this.scroll.y - getScrollBarSize()) + "px";
				}
				else {
					styles.tableBodyScrollbar.maxHeight = this.scroll.y + "px";
				}

				styles.tableBodyScrollbar.overflowY = "scroll";
			}
			else {
				styles.tableBodyScrollbar.width = width + "px";
			}

			// 计算 class 样式
			let classes = {
				table: {
					[`${this.classNamePrefix}-right`]: true
				},
				tableHeader: `${this.classNamePrefix}-header`,
				tableHeaderScrollbar: `${this.classNamePrefix}-header-scrollbar`,
				tableBody: `${this.classNamePrefix}-body`,
				tableBodyScrollbar: `${this.classNamePrefix}-body-scrollbar`
			};

			// 是否显示表头
			if (this.showHeader) {
				header = (
					<div ref="fixedRightHeader" class={classes.tableHeader}>
						<div ref="fixedRightHeaderScrollbar" class={classes.tableHeaderScrollbar}>
							<VuiTableThead
								fixed="right"
								classNamePrefix={this.classNamePrefix}
								scroll={this.scroll}
								getRowKey={this.getRowKey}
								rowCollapsion={this.rowCollapsion}
								rowSelection={this.rowSelection}
								locale={this.locale}
								store={this.store}
							/>
						</div>
					</div>
				);
			}

			// 表格内容
			body = (
				<div ref="fixedRightBody" class={classes.tableBody}>
					<div ref="fixedRightBodyScrollbar" style={styles.tableBodyScrollbar} class={classes.tableBodyScrollbar} onScroll={this.handleScroll}>
						<VuiTableTbody
							classNamePrefix={this.classNamePrefix}
							fixed={"right"}
							scroll={this.scroll}
							getRowKey={this.getRowKey}
							getRowClassName={this.getRowClassName}
							rowCollapsion={this.rowCollapsion}
							rowSelection={this.rowSelection}
							locale={this.locale}
							store={this.store}
						/>
					</div>
				</div>
			);

			return (
				<div class={classes.table} style={styles.table}>
					{header}
					{body}
				</div>
			);
		}
	},

	created() {
		let columns = mapColumnsToState(this.columns);
		let data = mapDataToState(this.data);
		let rowCollapsionState;
		let rowSelectionState;
		let rowHoverionState;

		if (this.rowCollapsion) {
			rowCollapsionState = this.rowCollapsion.value ? clone(this.rowCollapsion.value) : [];
		}

		if (this.rowSelection) {
			if (!("multiple" in this.rowSelection) || this.rowSelection.multiple) {
				rowSelectionState = this.rowSelection.value ? clone(this.rowSelection.value) : [];
			}
			else {
				rowSelectionState = this.rowSelection.value ? this.rowSelection.value : undefined;
			}
		}

		this.store.columns = columns;
		this.store.data = data;
		this.store.colgroup = this.getColgroupData(this.store.columns);
		this.store.thead = this.getTheadData(this.store.columns);
		this.store.tbody = this.getTbodyData(this.store.data);
		this.store.rowCollapsionState = rowCollapsionState;
		this.store.rowSelectionState = rowSelectionState;
		this.store.rowHoverionState = rowHoverionState;
	},

	render() {
		let { classes, loading, drawLeftTable, drawMiddleTable, drawRightTable } = this;

		return (
			<div class={classes.el}>
				<div ref="table" class={classes.elTable}>
					{drawLeftTable()}
					{drawMiddleTable()}
					{drawRightTable()}
				</div>
				{loading ? <vui-spin fixed /> : null}
			</div>
		);
	}
};

export default VuiTable;
