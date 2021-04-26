import VuiSpin from "vui-design/components/spin";
import VuiAffix from "vui-design/components/affix";
import VuiTableThead from "./table-thead";
import VuiTableTbody from "./table-tbody";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import flatten from "vui-design/utils/flatten";
import getTargetByPath from "vui-design/utils/getTargetByPath";
import getScrollbarSize from "vui-design/utils/getScrollbarSize";
import csv from "vui-design/utils/csv";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
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
		classNamePrefix: {
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
		size: {
			type: String,
			default: "medium",
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		scroll: {
			type: Object,
			default: undefined
		},
		affix: {
			type: Boolean,
			default: false
		},
		loading: {
			type: Boolean,
			default: false
		},
		rowKey: {
			type: [String, Function],
			default: "key"
		},
		rowClassName: {
			type: [String, Function],
			default: undefined
		},
		locale: {
			type: Object,
			default: undefined
		}
	},

	data() {
		const state = {
			columns: [],
			data: [],
			hoveredRowKey: undefined,
			openedRowKeys: [],
			expandedRowKeys: [],
			selectedRowKeys: [],
			colgroup: [],
			thead: [],
			tbody: []
		};

		return { state };
	},

	watch: {
		columns: {
			handler(value) {
				const { $props: props } = this;
				const columns = utils.getStateColumnsFromProps(value);

				this.state.columns = columns;
				this.state.colgroup = utils.getStateTableColgroup(this.state);
				this.state.thead = utils.getStateTableThead(this.state);
				this.state.tbody = utils.getStateTableTbody(props, this.state);
			}
		},
		data: {
			handler(value) {
				const { $props: props } = this;
				const data = utils.getStateDataFromProps(value);

				this.state.data = data;
				this.state.tbody = utils.getStateTableTbody(props, this.state);
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
		// 同步横向滚动位置
		changeScrollXPosition(e) {
			if (e.currentTarget !== e.target) {
				return;
			}

			const { $refs: refs } = this;
			const { tableMiddleHeaderScrollbar, tableMiddleBodyScrollbar } = refs;
			const target = e.target;
			const scrollLeft = target.scrollLeft;

			if (scrollLeft !== this.lastScrollLeft) {
				if (target === tableMiddleHeaderScrollbar && tableMiddleBodyScrollbar) {
					tableMiddleBodyScrollbar.scrollLeft = scrollLeft;
				}

				if (target === tableMiddleBodyScrollbar && tableMiddleHeaderScrollbar) {
					tableMiddleHeaderScrollbar.scrollLeft = scrollLeft;
				}
			}

			this.lastScrollLeft = scrollLeft;
		},
		// 同步纵向滚动位置
		changeScrollYPosition(e) {
			if (e.currentTarget !== e.target) {
				return;
			}

			const { $refs: refs } = this;
			const { tableLeftBodyScrollbar, tableMiddleBodyScrollbar, tableRightBodyScrollbar } = refs;
			const target = e.target;
			const scrollTop = target.scrollTop;

			if (scrollTop !== this.lastScrollTop) {
				if (tableLeftBodyScrollbar && target !== tableLeftBodyScrollbar) {
					tableLeftBodyScrollbar.scrollTop = scrollTop;
				}

				if (tableMiddleBodyScrollbar && target !== tableMiddleBodyScrollbar) {
					tableMiddleBodyScrollbar.scrollTop = scrollTop;
				}

				if (tableRightBodyScrollbar && target !== tableRightBodyScrollbar) {
					tableRightBodyScrollbar.scrollTop = scrollTop;
				}
			}

			this.lastScrollTop = scrollTop; 
		},
		// 滚动事件回调函数
		handleScroll(e) {
			this.changeScrollXPosition(e);
			this.changeScrollYPosition(e);
		},
		// 行鼠标移入事件回调函数
		handleRowMouseenter(row, rowIndex, rowKey) {
			this.state.hoveredRowKey = rowKey;
			this.$emit("rowMouseenter", row, rowIndex, rowKey);
		},
		// 行鼠标移出事件回调函数
		handleRowMouseleave(row, rowIndex, rowKey) {
			this.state.hoveredRowKey = undefined;
			this.$emit("rowMouseleave", row, rowIndex, rowKey);
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
			const { $props: props, state } = this;

			if (!props.rowTreeview) {
				return;
			}

			let openedRowKeys = clone(state.openedRowKeys);
			const index = openedRowKeys.indexOf(rowKey);

			if (index === -1) {
				openedRowKeys.push(rowKey);
			}
			else {
				openedRowKeys.splice(index, 1);
			}

			this.state.openedRowKeys = openedRowKeys;
			this.$emit("rowToggle", clone(this.state.openedRowKeys));
		},
		// 行展开事件回调函数
		handleRowExpand(row, rowIndex, rowKey) {
			const { $props: props, state } = this;

			if (!props.rowExpansion) {
				return;
			}

			let expandedRowKeys = clone(state.expandedRowKeys);
			const index = expandedRowKeys.indexOf(rowKey);

			if (props.rowExpansion.accordion) {
				expandedRowKeys = index === -1 ? [rowKey] : [];
			}
			else {
				if (index === -1) {
					expandedRowKeys.push(rowKey);
				}
				else {
					expandedRowKeys.splice(index, 1);
				}
			}

			this.state.expandedRowKeys = expandedRowKeys;
			this.$emit("rowExpand", clone(this.state.expandedRowKeys));
		},
		// 行选择事件回调函数
		handleRowSelect(checked, row, rowIndex, rowKey) {
			const { $props: props, state } = this;

			if (!props.rowSelection) {
				return;
			}

			const isMultiple = utils.getSelectionMultiple(props.rowSelection);
			let selectedRowKeys = clone(state.selectedRowKeys);

			if (isMultiple) {
				if (props.rowTreeview && !props.rowSelection.strictly) {
					const treemap = utils.getTreemap(state.tbody, props.rowKey, props.rowTreeview.children);
					const children = utils.getTreemapChildren(treemap, rowKey);
					const parents = utils.getTreemapParents(treemap, rowKey);

					if (checked) {
						if (selectedRowKeys.indexOf(rowKey) === -1) {
							selectedRowKeys.push(rowKey);
						}
					}
					else {
						const index = selectedRowKeys.indexOf(rowKey);

						if (index > -1) {
							selectedRowKeys.splice(index, 1);
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

							if (checked) {
								if (selectedRowKeys.indexOf(childKey) === -1) {
									selectedRowKeys.push(childKey);
								}
							}
							else {
								const index = selectedRowKeys.indexOf(childKey);

								if (index > -1) {
									selectedRowKeys.splice(index, 1);
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
								selectedRowKeys
							});

							if (status.checked) {
								if (selectedRowKeys.indexOf(parentKey) === -1) {
									selectedRowKeys.push(parentKey);
								}
							}
							else {
								const index = selectedRowKeys.indexOf(parentKey);

								if (index > -1) {
									selectedRowKeys.splice(index, 1);
								}
							}
						});
					}
				}
				else {
					if (checked) {
						if (selectedRowKeys.indexOf(rowKey) === -1) {
							selectedRowKeys.push(rowKey);
						}
					}
					else {
						const index = selectedRowKeys.indexOf(rowKey);

						if (index > -1) {
							selectedRowKeys.splice(index, 1);
						}
					}
				}
			}
			else {
				selectedRowKeys = checked ? rowKey : undefined;
			}

			this.state.selectedRowKeys = selectedRowKeys;
			this.$emit("rowSelect", clone(this.state.selectedRowKeys));
		},
		// 全选&取消全选事件回调函数
		handleSelectAll(checked) {
			const { $props: props, state } = this;

			// 以下两种情况返回不处理
			// 1、未启用行选择功能
			// 2、已启用行选择功能，但是使用单选模式
			if (!props.rowSelection || props.rowSelection.multiple === false) {
				return;
			}

			// 
			let rows = [];
			let selectedRowKeys = clone(state.selectedRowKeys);

			if (props.rowTreeview) {
				rows = flatten(state.tbody, props.rowTreeview.children, true);
			}
			else {
				rows = state.tbody;
			}

			rows.forEach((row, rowIndex) => {
				const rowKey = utils.getRowKey(row, props.rowKey);
				const componentProps = utils.getSelectionComponentProps(row, rowKey, props.rowSelection);
				const isEnabled = !componentProps || !componentProps.disabled;

				if (!isEnabled) {
					return;
				}

				if (checked) {
					if (selectedRowKeys.indexOf(rowKey) === -1) {
						selectedRowKeys.push(rowKey);
					}
				}
				else {
					const index = selectedRowKeys.indexOf(rowKey);

					if (index > -1) {
						selectedRowKeys.splice(index, 1);
					}
				}
			});

			this.state.selectedRowKeys = selectedRowKeys;
			this.$emit("rowSelect", clone(this.state.selectedRowKeys));
		},
		// 筛选事件回调函数
		handleFilter(column, value) {
			let { $props: props, state } = this;

			if (!column.filter) {
				return;
			}

			this.changeFilterColumnState(state.columns, column.key, value);

			if (!column.filter.useServerFilter) {
				this.state.tbody = utils.getStateTableTbody(props, state);
			}

			this.$emit("filter", clone(column), value);
		},
		// 排序事件回调函数
		handleSort(column, order) {
			let { $props: props, state } = this;

			if (!column.sorter) {
				return;
			}

			this.changeSorterColumnState(state.columns, column.key, order);

			if (!column.sorter.useServerSort) {
				this.state.tbody = utils.getStateTableTbody(props, state);
			}

			this.$emit("sort", clone(column), order);
		},
		// 绘制左固定表格
		renderLeftTable() {
			let { $props: props, state } = this;
			let header;
			let body;

			// 计算 style 样式
			let width = state.colgroup.filter(column => column.fixed === "left").reduce((total, column) => total + column.width, 0);

			if (props.rowExpansion) {
				width += props.rowExpansion.width || 50;
			}

			if (props.rowSelection) {
				width += props.rowSelection.width || 50;
			}

			let showXScrollbar = props.scroll && props.scroll.x > 0;
			let showYScrollbar = props.scroll && props.scroll.y > 0;
			let styles = {
				el: {
					width: `${width}px`
				}
			};

			if (showYScrollbar) {
				let scrollbarSize = getScrollbarSize();

				styles.elBodyScrollbar = {
					width: `${width + scrollbarSize}px`,
					height: showXScrollbar ? `${props.scroll.y - scrollbarSize}px` : `${props.scroll.y}px`,
					overflowY: `scroll`
				};
			}
			else {
				styles.elBodyScrollbar = {
					width: `${width}px`
				};
			}

			// 计算 class 样式
			let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "table");
			let classes = {
				el: `${classNamePrefix}-left`,
				elHeader: `${classNamePrefix}-header`,
				elHeaderScrollbar: `${classNamePrefix}-header-scrollbar`,
				elBody: `${classNamePrefix}-body`,
				elBodyScrollbar: `${classNamePrefix}-body-scrollbar`
			};

			// 是否显示表头
			if (props.showHeader) {
				header = (
					<div ref="tableLeftHeader" class={classes.elHeader}>
						<div ref="tableLeftHeaderScrollbar" class={classes.elHeaderScrollbar}>
							<VuiTableThead
								fixed="left"
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
								hoveredRowKey={state.hoveredRowKey}
								openedRowKeys={state.openedRowKeys}
								expandedRowKeys={state.expandedRowKeys}
								selectedRowKeys={state.selectedRowKeys}
								scroll={props.scroll}
								locale={props.locale}
							/>
						</div>
					</div>
				);

				if (props.affix) {
					header = (
						<VuiAffix>{header}</VuiAffix>
					);
				}
			}

			// 表格内容
			body = (
				<div ref="tableLeftBody" class={classes.elBody}>
					<div ref="tableLeftBodyScrollbar" style={styles.elBodyScrollbar} class={classes.elBodyScrollbar} onScroll={this.handleScroll}>
						<VuiTableTbody
							fixed="left"
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
							hoveredRowKey={state.hoveredRowKey}
							openedRowKeys={state.openedRowKeys}
							expandedRowKeys={state.expandedRowKeys}
							selectedRowKeys={state.selectedRowKeys}
							scroll={props.scroll}
							locale={props.locale}
						/>
					</div>
				</div>
			);

			return (
				<div class={classes.el} style={styles.el}>
					{header}
					{body}
				</div>
			);
		},
		// 绘制中间表格
		renderMiddleTable() {
			let { $props: props, state } = this;
			let header;
			let body;

			// 计算 style 样式
			let width = state.colgroup.filter(column => column.fixed === "left").reduce((total, column) => total + column.width, 0);
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
				el: `${classNamePrefix}-middle`,
				elHeader: `${classNamePrefix}-header`,
				elHeaderScrollbar: `${classNamePrefix}-header-scrollbar`,
				elBody: `${classNamePrefix}-body`,
				elBodyScrollbar: `${classNamePrefix}-body-scrollbar`
			};

			// 是否显示表头
			if (props.showHeader) {
				header = (
					<div ref="tableMiddleHeader" class={classes.elHeader}>
						<div ref="tableMiddleHeaderScrollbar" style={styles.elHeaderScrollbar} class={classes.elHeaderScrollbar}>
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
								hoveredRowKey={state.hoveredRowKey}
								openedRowKeys={state.openedRowKeys}
								expandedRowKeys={state.expandedRowKeys}
								selectedRowKeys={state.selectedRowKeys}
								scroll={props.scroll}
								locale={props.locale}
							/>
						</div>
					</div>
				);

				if (props.affix) {
					header = (
						<VuiAffix>{header}</VuiAffix>
					);
				}
			}

			// 表格内容
			body = (
				<div ref="tableMiddleBody" class={classes.elBody}>
					<div ref="tableMiddleBodyScrollbar" class={classes.elBodyScrollbar} style={styles.elBodyScrollbar} onScroll={this.handleScroll}>
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
							hoveredRowKey={state.hoveredRowKey}
							openedRowKeys={state.openedRowKeys}
							expandedRowKeys={state.expandedRowKeys}
							selectedRowKeys={state.selectedRowKeys}
							scroll={props.scroll}
							locale={props.locale}
						/>
					</div>
				</div>
			);

			return (
				<div class={classes.el}>
					{header}
					{body}
				</div>
			);
		},
		// 绘制右固定表格
		renderRightTable() {
			let { $props: props, state } = this;
			let header;
			let body;

			// 计算 style 样式
			let width = state.colgroup.filter(column => column.fixed === "right").reduce((total, column) => total + column.width, 0);
			let showXScrollbar = props.scroll && props.scroll.x > 0;
			let showYScrollbar = props.scroll && props.scroll.y > 0;
			let styles = {
				el: {
					width: `${width}px`
				}
			};

			if (showYScrollbar) {
				let scrollbarSize = getScrollbarSize();

				styles.el.right = `${scrollbarSize}px`;
				styles.elBodyScrollbar = {
					width: `${width + scrollbarSize}px`,
					height: showXScrollbar ? `${props.scroll.y - scrollbarSize}px` : `${props.scroll.y}px`,
					overflowY: `scroll`
				};
			}
			else {
				styles.elBodyScrollbar = {
					width: `${width}px`
				};
			}

			// 计算 class 样式
			let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "table");
			let classes = {
				el: `${classNamePrefix}-right`,
				elHeader: `${classNamePrefix}-header`,
				elHeaderScrollbar: `${classNamePrefix}-header-scrollbar`,
				elBody: `${classNamePrefix}-body`,
				elBodyScrollbar: `${classNamePrefix}-body-scrollbar`
			};

			// 是否显示表头
			if (props.showHeader) {
				header = (
					<div ref="tableRightHeader" class={classes.elHeader}>
						<div ref="tableRightHeaderScrollbar" class={classes.elHeaderScrollbar}>
							<VuiTableThead
								fixed="right"
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
								hoveredRowKey={state.hoveredRowKey}
								openedRowKeys={state.openedRowKeys}
								expandedRowKeys={state.expandedRowKeys}
								selectedRowKeys={state.selectedRowKeys}
								scroll={props.scroll}
								locale={props.locale}
							/>
						</div>
					</div>
				);

				if (props.affix) {
					header = (
						<VuiAffix>{header}</VuiAffix>
					);
				}
			}

			// 表格内容
			body = (
				<div ref="tableRightBody" class={classes.elBody}>
					<div ref="tableRightBodyScrollbar" style={styles.elBodyScrollbar} class={classes.elBodyScrollbar} onScroll={this.handleScroll}>
						<VuiTableTbody
							fixed="right"
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
							hoveredRowKey={state.hoveredRowKey}
							openedRowKeys={state.openedRowKeys}
							expandedRowKeys={state.expandedRowKeys}
							selectedRowKeys={state.selectedRowKeys}
							scroll={props.scroll}
							locale={props.locale}
						/>
					</div>
				</div>
			);

			return (
				<div class={classes.el} style={styles.el}>
					{header}
					{body}
				</div>
			);
		}
	},

	created() {
		const { $props: props } = this;
		const { rowTreeview, rowExpansion, rowSelection } = props;

		let columns = utils.getStateColumnsFromProps(props.columns);
		let data = utils.getStateDataFromProps(props.data);
		let hoveredRowKey = undefined;
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

		this.state.columns = columns;
		this.state.data = data;
		this.state.hoveredRowKey = hoveredRowKey;
		this.state.openedRowKeys = openedRowKeys;
		this.state.expandedRowKeys = expandedRowKeys;
		this.state.selectedRowKeys = selectedRowKeys;
		this.state.colgroup = utils.getStateTableColgroup(this.state);
		this.state.thead = utils.getStateTableThead(this.state);
		this.state.tbody = utils.getStateTableTbody(props, this.state);
	},

	render() {
		const { $props: props, state } = this;
		const { renderLeftTable, renderMiddleTable, renderRightTable } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "table");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}-wrapper`]: true,
			[`${classNamePrefix}-wrapper-bordered`]: props.bordered
		};
		classes.elTable = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-bordered`]: props.bordered,
			[`${classNamePrefix}-striped`]: props.striped,
			[`${classNamePrefix}-${props.size}`]: props.size
		};

		// render
		const showLeftTable = state.columns.some(column => column.fixed === "left");
		const showRightTable = state.columns.some(column => column.fixed === "right");

		return (
			<VuiSpin spinning={props.loading}>
				<div class={classes.el}>
					<div ref="table" class={classes.elTable}>
						{showLeftTable && renderLeftTable()}
						{renderMiddleTable()}
						{showRightTable && renderRightTable()}
					</div>
				</div>
			</VuiSpin>
		);
	}
};

export default VuiTable;