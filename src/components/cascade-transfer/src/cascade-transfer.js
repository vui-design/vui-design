import VuiCascadeTransferSourceList from "./cascade-transfer-source-list";
import VuiCascadeTransferSource from "./cascade-transfer-source";
import VuiCascadeTransferTarget from "./cascade-transfer-target";
import Emitter from "../../../mixins/emitter";
import PropTypes from "../../../utils/prop-types";
import clone from "../../../utils/clone";
import flatten from "../../../utils/flatten";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";
import utils from "./utils";

const VuiCascadeTransfer = {
	name: "vui-cascade-transfer",
	inject: {
		vuiForm: {
			default: undefined
		}
	},
	components: {
		VuiCascadeTransferSourceList,
		VuiCascadeTransferSource,
		VuiCascadeTransferTarget
	},
	mixins: [
		Emitter
	],
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		classNamePrefix: PropTypes.string,
		value: PropTypes.array.def([]),
		options: PropTypes.array.def([]),
		valueKey: PropTypes.string.def("value"),
		childrenKey: PropTypes.string.def("children"),
		title: PropTypes.func.def(props => ""),
		formatter: PropTypes.func.def(option => option.label),
		locale: PropTypes.object,
		showTargetPanel: PropTypes.bool.def(true),
		showSelectAll: PropTypes.bool.def(true),
		showClear: PropTypes.bool.def(true),
		disabled: PropTypes.bool.def(false),
		validator: PropTypes.bool.def(true)
	},
	data() {
		const { $props: props } = this;
		const sourceList = [];
		const source = {
			parent: undefined,
			options: props.options
		};

		return {
			state: {
				selectedKeys: utils.mapValueToSelectedKeys(props.value, props.options, props.valueKey, props.childrenKey),
				value: clone(props.value),
				sourceList: sourceList.concat(source)
			}
		};
	},
	watch: {
		value(value) {
			const { $props: props } = this;

			this.state.selectedKeys = utils.mapValueToSelectedKeys(value, props.options, props.valueKey, props.childrenKey);
			this.state.value = clone(value);
		},
		options(value) {
			const { $props: props } = this;
			const sourceList = [];
			const source = {
				parent: undefined,
				options: value
			};

			this.state.selectedKeys = utils.mapValueToSelectedKeys(props.value, value, props.valueKey, props.childrenKey);
			this.state.value = clone(props.value);
			this.state.sourceList = sourceList.concat(source);
		}
	},
	methods: {
		upward(checked, option, selectedKeys) {
			const { $props: props } = this;
			const parent = utils.getParent(option, undefined, props.options, props.valueKey, props.childrenKey);

			if (!parent) {
				return;
			}

			if (checked) {
				const siblings = parent[props.childrenKey];
				const isEveryChecked = siblings.every(sibling => selectedKeys.indexOf(sibling[props.valueKey]) > -1);

				if (!isEveryChecked) {
					return;
				}

				const value = parent[props.valueKey];
				const index = selectedKeys.indexOf(value);

				if (index === -1) {
					selectedKeys.push(value);
					this.upward(checked, parent, selectedKeys);
				}
			}
			else {
				const value = parent[props.valueKey];
				const index = selectedKeys.indexOf(value);

				if (index > -1) {
					selectedKeys.splice(index, 1);
					this.upward(checked, parent, selectedKeys);
				}
			}
		},
		downward(checked, option, selectedKeys) {
			const { $props: props } = this;
			const children = option[props.childrenKey];

			if (!children || children.length === 0) {
				return;
			}

			children.forEach(child => {
				const value = child[props.valueKey];
				const index = selectedKeys.indexOf(value);

				if (checked) {
					if (index === -1) {
						selectedKeys.push(value);
					}
				}
				else {
					if (index > -1) {
						selectedKeys.splice(index, 1);
					}
				}

				this.downward(checked, child, selectedKeys);
			});
		},
		handleClick(option, level) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			const children = option[props.childrenKey];

			if (children && children.length > 0) {
				const sourceList = this.state.sourceList.slice(0, level);
				const source = {
					parent: option,
					options: children
				};

				this.state.sourceList = sourceList.concat(source);
			}

			this.$emit("click", option);
		},
		handleSelectAll(checked, option, level) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			if (level > 0) {
				this.handleSelect(checked, option);
				return;
			}

			let selectedKeys = clone(this.state.selectedKeys);
			const options = flatten(props.options, props.childrenKey, true);

			if (checked) {
				const unSelectedKeys = options.map(target => target[props.valueKey]).filter(targetKey => selectedKeys.indexOf(targetKey) === -1);

				selectedKeys = selectedKeys.concat(unSelectedKeys);
			}
			else {
				selectedKeys = [];
			}

			this.state.selectedKeys = selectedKeys;
			this.handleChange();
		},
		handleSelect(checked, option) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			let selectedKeys = clone(this.state.selectedKeys);
			const value = option[props.valueKey];
			const index = selectedKeys.indexOf(value);

			if (checked) {
				if (index === -1) {
					selectedKeys.push(value);
				}
			}
			else {
				if (index > -1) {
					selectedKeys.splice(index, 1);
				}
			}

			this.upward(checked, option, selectedKeys);
			this.downward(checked, option, selectedKeys);

			this.state.selectedKeys = selectedKeys;
			this.handleChange();
		},
		handleDeselect(option) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.handleSelect(false, option);
		},
		handleClear() {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			this.state.selectedKeys = [];
			this.handleChange();
		},
		handleChange() {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			const value = utils.mapSelectedKeysToValue(this.state.selectedKeys, props.options, props.valueKey, props.childrenKey);

			this.state.value = value;
			this.$emit("input", value);
			this.$emit("change", value);

			if (props.validator) {
				this.dispatch("vui-form-item", "change", value);
			}
		}
	},
	render() {
		const { $scopedSlots: scopedSlots, $props: props, state } = this;
		const { handleClick, handleSelectAll, handleSelect, handleDeselect, handleClear } = this;

		// formatter
		const formatter = scopedSlots.formatter || props.formatter;

		// body
		const body = scopedSlots.body;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "cascade-transfer");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-disabled`]: props.disabled
		};

		// render
		let children = [];

		children.push(
			<VuiCascadeTransferSourceList classNamePrefix={classNamePrefix}>
				{
					state.sourceList.map((source, index) => {
						return (
							<VuiCascadeTransferSource
								key={index}
								classNamePrefix={classNamePrefix}
								level={index + 1}
								parent={source.parent}
								selectedKeys={state.selectedKeys}
								options={source.options}
								valueKey={props.valueKey}
								childrenKey={props.childrenKey}
								title={props.title}
								formatter={props.formatter}
								body={props.body}
								locale={props.locale}
								showSelectAll={props.showSelectAll}
								disabled={props.disabled}
								onClick={handleClick}
								onSelectAll={handleSelectAll}
								onSelect={handleSelect}
							/>
						);
					})
				}
			</VuiCascadeTransferSourceList>
		);

		if (props.showTargetPanel) {
			children.push(
				<VuiCascadeTransferTarget
					classNamePrefix={classNamePrefix}
					title={props.title}
					value={state.value}
					options={props.options}
					valueKey={props.valueKey}
					childrenKey={props.childrenKey}
					formatter={formatter}
					body={body}
					showClear={props.showClear}
					disabled={props.disabled}
					locale={props.locale}
					onDeselect={handleDeselect}
					onClear={handleClear}
				/>
			);
		}

		return (
			<div class={classes.el}>
				{children}
			</div>
		);
	}
};

export default VuiCascadeTransfer;