import VuiTransferPanel from "./transfer-panel";
import VuiTransferOperation from "./transfer-operation";
import Emitter from "vui-design/mixins/emitter";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

const VuiTransfer = {
	name: "vui-transfer",
	inject: {
		vuiForm: {
			default: undefined
		}
	},
	components: {
		VuiTransferPanel,
		VuiTransferOperation
	},
	mixins: [
		Emitter
	],
	model: {
		prop: "targetKeys",
		event: "input"
	},
	props: {
		classNamePrefix: PropTypes.string,
		titles: PropTypes.array.def(["", ""]),
		operations: PropTypes.array.def([]),
		panelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.string, PropTypes.func]),
		data: PropTypes.array.def([]),
		optionKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def("key"),
		selectedKeys: PropTypes.array.def([]),
		targetKeys: PropTypes.array.def([]),
		option: PropTypes.func.def(option => option.key),
		showSelectAll: PropTypes.bool.def(true),
		searchable: PropTypes.bool.def(false),
		filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).def(true),
		filterOptionProp: PropTypes.string.def("label"),
		disabled: PropTypes.bool.def(false),
		locale: PropTypes.object,
		validator: PropTypes.bool.def(true)
	},
	data() {
		const { $props: props } = this;
		const targetKeys = clone(props.targetKeys);
		const state = {
			sourceSelectedKeys: props.selectedKeys.filter(selectedKey => targetKeys.indexOf(selectedKey) === -1),
			targetSelectedKeys: props.selectedKeys.filter(selectedKey => targetKeys.indexOf(selectedKey) > -1),
			targetKeys
		};

		return {
			state
		};
	},
	watch: {
		selectedKeys(value) {
			const { $props: props } = this;
			const targetKeys = clone(props.targetKeys);

			this.state.sourceSelectedKeys = value.filter(selectedKey => targetKeys.indexOf(selectedKey) === -1);
			this.state.targetSelectedKeys = value.filter(selectedKey => targetKeys.indexOf(selectedKey) > -1);
			this.state.targetKeys = targetKeys;
		},
		targetKeys(value) {
			const { $props: props } = this;
			const targetKeys = clone(value);

			this.state.sourceSelectedKeys = props.selectedKeys.filter(selectedKey => targetKeys.indexOf(selectedKey) === -1);
			this.state.targetSelectedKeys = props.selectedKeys.filter(selectedKey => targetKeys.indexOf(selectedKey) > -1);
			this.state.targetKeys = targetKeys;
		}
	},
	methods: {
		getDataSource() {
			const { $props: props, state } = this;
			const left = [];
			const right = new Array(state.targetKeys.length);

			props.data.forEach(item => {
				const optionKey = utils.getOptionKey(item, props.optionKey);
				const index = state.targetKeys.indexOf(optionKey);

				if (index === -1) {
					left.push(item);
				}
				else {
					right[index] = item;
				}
			});

			return {
				left,
				right
			};
		},
		getPanelStyle(direction, panelStyle) {
			if (is.function(panelStyle)) {
				return panelStyle(direction);
			}

			return panelStyle;
		},
		handleSearch(direction, keyword) {
			this.$emit("search", direction, keyword);
		},
		handleLeftSearch(keyword) {
			this.handleSearch("left", keyword);
		},
		handleRightSearch(keyword) {
			this.handleSearch("right", keyword);
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
		handleSelect(direction, selectedKeys) {
			if (direction === "left") {
				this.state.sourceSelectedKeys = selectedKeys;
			}
			else {
				this.state.targetSelectedKeys = selectedKeys;
			}

			this.$emit("select", clone(this.state.sourceSelectedKeys), clone(this.state.targetSelectedKeys));
		},
		handleLeftSelect(selectedKeys) {
			this.handleSelect("left", selectedKeys);
		},
		handleRightSelect(selectedKeys) {
			this.handleSelect("right", selectedKeys);
		},
		handleMoveTo(direction) {
			const { $props: props, state } = this;
			const selectedKeys = direction === "right" ? state.sourceSelectedKeys : state.targetSelectedKeys;
			const moveKeys = selectedKeys.filter(selectedKey => {
				const disabled = props.data.some(item => {
					return selectedKey === utils.getOptionKey(item, props.optionKey) && item.disabled;
				});

				return !disabled;
			});
			const targetKeys = direction === "right" ? moveKeys.concat(state.targetKeys) : state.targetKeys.filter(targetKey => moveKeys.indexOf(targetKey) === -1);

			if (direction === "right") {
				this.handleLeftSelect([]);
			}
			else {
				this.handleRightSelect([]);
			}

			this.$emit("input", targetKeys);
			this.$emit("change", targetKeys, direction, moveKeys);

			if (props.validator) {
				this.dispatch("vui-form-item", "change", targetKeys);
			}
		},
		handleMoveToLeft() {
			this.handleMoveTo("left");
		},
		handleMoveToRight() {
			this.handleMoveTo("right");
		}
	},
	render() {
		const { $scopedSlots: scopedSlots, $props: props, state } = this;
		const { handleLeftSearch, handleRightSearch, handleLeftScroll, handleRightScroll, handleLeftSelect, handleRightSelect, handleMoveToRight, handleMoveToLeft } = this;

		// dataSource
		const dataSource = this.getDataSource();

		// panelStyle
		const panelLeftStyle = this.getPanelStyle("left", props.panelStyle);
		const panelRightStyle = this.getPanelStyle("right", props.panelStyle);

		// arrow disabled
		const arrowRightDisabled = state.sourceSelectedKeys.length === 0;
		const arrowLeftDisabled = state.targetSelectedKeys.length === 0;

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
				<VuiTransferPanel
					key="left"
					classNamePrefix={classNamePrefix}
					direction="left"
					title={props.titles[0]}
					data={dataSource.left}
					optionKey={props.optionKey}
					selectedKeys={state.sourceSelectedKeys}
					option={scopedSlots.option || props.option}
					body={scopedSlots.body}
					footer={scopedSlots.footer}
					showSelectAll={props.showSelectAll}
					searchable={props.searchable}
					filter={props.filter}
					filterOptionProp={props.filterOptionProp}
					disabled={props.disabled}
					locale={props.locale}
					style={panelLeftStyle}
					onSearch={handleLeftSearch}
					onScroll={handleLeftScroll}
					onSelect={handleLeftSelect}
				/>
				<VuiTransferOperation
					key="operation"
					classNamePrefix={classNamePrefix}
					disabled={props.disabled}
					arrowRightText={props.operations[0]}
					arrowLeftText={props.operations[1]}
					arrowRightDisabled={arrowRightDisabled}
					arrowLeftDisabled={arrowLeftDisabled}
					moveToRight={handleMoveToRight}
					moveToLeft={handleMoveToLeft}
				/>
				<VuiTransferPanel
					key="right"
					classNamePrefix={classNamePrefix}
					direction="right"
					title={props.titles[1]}
					data={dataSource.right}
					optionKey={props.optionKey}
					selectedKeys={state.targetSelectedKeys}
					option={scopedSlots.option || props.option}
					body={scopedSlots.body}
					footer={scopedSlots.footer}
					showSelectAll={props.showSelectAll}
					searchable={props.searchable}
					filter={props.filter}
					filterOptionProp={props.filterOptionProp}
					disabled={props.disabled}
					locale={props.locale}
					style={panelRightStyle}
					onSearch={handleRightSearch}
					onScroll={handleRightScroll}
					onSelect={handleRightSelect}
				/>
			</div>
		);
	}
};

export default VuiTransfer;