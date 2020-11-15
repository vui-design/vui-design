import VuiTransferList from "./list";
import VuiTransferOperation from "./operation";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

const VuiTransfer = {
	name: "vui-transfer",
	components: {
		VuiTransferList,
		VuiTransferOperation
	},
	model: {
		prop: "targetKeys",
		event: "input"
	},
	props: {
		classNamePrefix: PropTypes.string,
		titles: PropTypes.array.def(["", ""]),
		footer: PropTypes.func,
		operations: PropTypes.array.def(["<", ">"]),
		listStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
		oneWay: PropTypes.bool.def(false),
		data: PropTypes.array.def([]),
		rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def("key"),
		render: PropTypes.func,
		selectedKeys: PropTypes.array.def([]),
		targetKeys: PropTypes.array.def([]),
		showSelectAll: PropTypes.bool.def(true),
		searchable: PropTypes.bool.def(false),
		filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).def(true),
		filterOptionProp: PropTypes.string.def("label"),
		disabled: PropTypes.bool.def(false)
	},
	data() {
		const { $props: props } = this;
		const state = {
			sourceSelectedKeys: props.selectedKeys.filter(key => targetKeys.indexOf(key) === -1),
			targetSelectedKeys: props.selectedKeys.filter(key => targetKeys.indexOf(key) > -1),
			targetKeys: []
		};

		return {
			state
		};
	},
	methods: {
		getListStyle(listStyle, direction) {
			if (is.function(listStyle)) {
				return listStyle(direction);
			}

			return listStyle;
		},
		getDataSource() {
			const { $props: props, state } = this;
			const left = [];
			const right = new Array(state.targetKeys.length);

			props.data.forEach(item => {
				const rowKey = utils.getRowKey(item, props.rowKey);
				const index = state.targetKeys.indexOf(rowKey);

				if (index === -1) {
					left.push(item);
				}
				else {
					right[index] = item;
				}
			});

			return {
				left,
				right,
			};
		},
		getSelectedKeysProp(direction) {
			return direction === "left" ? "sourceSelectedKeys" : "targetSelectedKeys";
		},
		handleScroll(e, direction) {
			this.$emit("scroll", e, direction);
		},
		handleLeftScroll(e) {
			this.handleScroll(e, "left");
		},
		handleRightScroll(e) {
			this.handleScroll(e, "right");
		},
		handleMoveTo(direction) {
			const { $props: props, state } = this;
			const { data = [], targetKeys = [] } = props;
			const moveKeys = direction === "right" ? state.sourceSelectedKeys : state.targetSelectedKeys;

			// filter the disabled options
			const newMoveKeys = moveKeys.filter(key => !props.data.some(item => !!(key === item.key && item.disabled)));

			// move items to target box
			const newTargetKeys = direction === "right" ? newMoveKeys.concat(targetKeys) : targetKeys.filter(targetKey => newMoveKeys.indexOf(targetKey) === -1);

			// empty checked keys
			const dir = direction === "right" ? "left" : "right";
			const selectedKeysProp = this.getSelectedKeysProp(dir);

			this.state[selectedKeysProp] = [];

			this.handleSelect(dir, []);

			this.$emit("input", newTargetKeys);
			this.$emit("change", newTargetKeys, direction, newMoveKeys);
		},
		handleMoveToLeft() {
			this.moveTo("left");
		},
		handleMoveToRight() {
			this.moveTo("right");
		},
		handleSelect(direction, newSelectedKeys) {
			const { state } = this;

			if (direction === "left") {
				this.$emit("select", newSelectedKeys, state.targetSelectedKeys);
			}
			else {
				this.$emit("select", state.sourceSelectedKeys, newSelectedKeys);
			}
		},
	},
	render() {
		const { $slots: slots, $props: props, state } = this;
		const data = this.getDataSource();

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "transfer");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-disabled`]: props.disabled
		};

		// render
		return (
			<div class={classes.el}>
				<VuiTransferList
					key="left"
					classNamePrefix={classNamePrefix}
					direction="left"
					title={props.titles[0]}
					footer={slots.footer || props.footer}
					data={data.left}
					rowKey={props.rowKey}
					selectedKeys={state.sourceSelectedKeys}
					showSelectAll={props.showSelectAll}
					searchable={props.searchable}
					filter={props.filter}
					filterOptionProp={props.filterOptionProp}
					disabled={props.disabled}
					style={this.getListStyle(props.listStyle, "left")}
					onScroll={this.handleLeftScroll}
					/*
					handleFilter={this.handleLeftFilter}
					handleClear={this.handleLeftClear}
					handleSelectAll={this.handleLeftSelectAll}
					onItemSelect={this.onLeftItemSelect}
					onItemSelectAll={this.onLeftItemSelectAll}
					renderItem={renderItem}
					body={body}
					renderList={children}
					showSelectAll={showSelectAll}
					notFoundContent={locale.notFoundContent}
					searchPlaceholder={locale.searchPlaceholder}
					*/
				/>
				<VuiTransferOperation
					key="operation"
					classNamePrefix={classNamePrefix}
					rightArrowText={props.operations[0]}
					moveToRight={this.handleMoveToRight}
					leftArrowText={props.operations[1]}
					moveToLeft={this.handleMoveToLeft}
					disabled={props.disabled}
				/>
				<VuiTransferList
					key="right"
					classNamePrefix={classNamePrefix}
					direction="right"
					title={props.titles[1]}
					footer={slots.footer || props.footer}
					data={data.right}
					selectedKeys={state.targetSelectedKeys}
					searchable={props.searchable}
					filter={props.filter}
					filterOptionProp={props.filterOptionProp}
					disabled={props.disabled}
					style={this.getListStyle(props.listStyle, "right")}
					onScroll={this.handleRightScroll}
					/*
					handleFilter={this.handleRightFilter}
					handleClear={this.handleRightClear}
					handleSelectAll={this.handleRightSelectAll}
					onItemSelect={this.onRightItemSelect}
					onItemSelectAll={this.onRightItemSelectAll}
					renderItem={renderItem}
					body={body}
					renderList={children}
					showSelectAll={showSelectAll}
					notFoundContent={locale.notFoundContent}
					searchPlaceholder={locale.searchPlaceholder}
					*/
				/>
			</div>
		);
	}
};

export default VuiTransfer;