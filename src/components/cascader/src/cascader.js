import VuiLazyRender from "vui-design/components/lazy-render";
import VuiCascaderSelection from "./cascader-selection";
import VuiCascaderDropdown from "./cascader-dropdown";
import VuiCascaderMenuList from "./cascader-menu-list";
import VuiCascaderMenu from "./cascader-menu";
import VuiCascaderEmpty from "./cascader-empty";
import Emitter from "vui-design/mixins/emitter";
import Locale from "vui-design/mixins/locale";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

const VuiCascader = {
	name: "vui-cascader",
	inject: {
		vuiForm: {
			default: undefined
		},
		vuiInputGroup: {
			default: undefined
		}
	},
	provide() {
		return {
			vuiCascader: this
		};
	},
	components: {
		VuiLazyRender,
		VuiCascaderSelection,
		VuiCascaderDropdown,
		VuiCascaderMenuList,
		VuiCascaderMenu,
		VuiCascaderEmpty
	},
	mixins: [
		Emitter,
		Locale
	],
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		classNamePrefix: PropTypes.string,
		size: PropTypes.oneOf(["small", "medium", "large"]),
		placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		value: PropTypes.array,
		options: PropTypes.array.def([]),
		expandTrigger: PropTypes.oneOf(["click", "hover"]).def("click"),
		optionKeys: PropTypes.object.def(utils.optionKeys),
		formatter: PropTypes.func.def((labels, options) => labels.join(" / ")),
		changeOnSelect: PropTypes.bool.def(false),
		searchable: PropTypes.bool.def(false),
		filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).def(true),
		filterOptionProp: PropTypes.string.def("label"),
		notFoundText: PropTypes.string,
		clearable: PropTypes.bool.def(false),
		disabled: PropTypes.bool.def(false),
		placement: PropTypes.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"]).def("bottom-start"),
		dropdownAutoWidth: PropTypes.bool.def(false),
		animation: PropTypes.string.def("vui-cascader-dropdown-scale"),
		getPopupContainer: PropTypes.any.def(() => document.body),
		validator: PropTypes.bool.def(true)
	},
	data() {
		const { $props: props } = this;
		const optionKeys = utils.getOptionKeys(props.optionKeys);

		return {
			state: {
				hovered: false,
				focused: false,
				actived: false,
				searching: false,
				keyword: "",
				value: this.getDerivedStateValueFromProps({
					value: props.value,
					options: props.options,
					optionKeys: optionKeys
				}),
				options: []
			}
		};
	},
	watch: {
		value(value) {
			const { $props: props } = this;
			const optionKeys = utils.getOptionKeys(props.optionKeys);

			this.state.value = this.getDerivedStateValueFromProps({
				value: value,
				options: props.options,
				optionKeys: optionKeys
			});
		},
		options(value) {
			const { $props: props } = this;
			const optionKeys = utils.getOptionKeys(props.optionKeys);

			this.state.value = this.getDerivedStateValueFromProps({
				value: props.value,
				options: value,
				optionKeys: optionKeys
			});
		}
	},
	methods: {
		getDropdownReference() {
			return this.$refs.selection.$el;
		},
		getDerivedStateValueFromProps(props) {
			let value = clone(props.value);
			let result = [];

			if (!value.length) {
				return result;
			}

			const { value: valueKey, children: childrenKey } = props.optionKeys;
			const target = value.shift();
			const option = props.options.find(option => option[valueKey] === target);

			if (option) {
				result = result.concat(clone(option));

				if (option[childrenKey]) {
					result = result.concat(this.getDerivedStateValueFromProps({
						value: value,
						options: option[childrenKey],
						optionKeys: props.optionKeys
					}));
				}
			}

			return result;
		},
		getFilteredOptions(state, props) {
			const optionKeys = utils.getOptionKeys(props.optionKeys);
			const options = utils.flatten(null, props.options, optionKeys);
			const predicate = is.function(props.filter) ? props.filter : utils.filter;
			let list = [];

			options.forEach(option => {
				if (!props.changeOnSelect && !option.leaf) {
					return;
				}

				if (!predicate(state.keyword, option, optionKeys[props.filterOptionProp])) {
					return;
				}

				let item = {
					...option
				};

				item[optionKeys.label] = item[optionKeys.label].replace(new RegExp(state.keyword, "g"), "<b>" + state.keyword + "</b>");

				list.push(item);
			});

			return list;
		},
		focus() {
			this.$refs.selection && this.$refs.selection.focus();
		},
		blur() {
			this.$refs.selection && this.$refs.selection.blur();
		},
		handleDropdownBeforeOpen() {

		},
		handleDropdownAfterClose() {
			this.state.searching = false;
			this.state.options = [];
		},
		handleSelectionMouseenter(e) {
			this.state.hovered = true;
			this.$emit("mouseenter", e);
		},
		handleSelectionMouseleave(e) {
			this.state.hovered = false;
			this.$emit("mouseleave", e);
		},
		handleSelectionClick(e) {
			const { $props: props, state } = this;

			this.state.actived = props.searchable ? true : !state.actived;
		},
		handleSelectionFocus(e) {
			this.state.focused = true;
			this.$emit("focus", e);
		},
		handleSelectionBlur(e) {
			const keyword = "";

			this.state.focused = false;
			this.state.actived = false;
			this.state.keyword = keyword;
			this.$emit("blur", e);
		},
		handleSelectionKeydown(e) {
			const keyCode = e.keyCode;

			if (!this.state.actived && [38, 40].indexOf(keyCode) > -1) {
				e.preventDefault();
				this.state.actived = true;
			}
		},
		handleSelectionInput(e) {
			if (/^composition(start|update)?$/g.test(e.type)) {
				this.compositing = true;
			}
			else if (/^composition(end)?$/g.test(e.type)) {
				this.compositing = false;
			}

			if (this.compositing) {
				return;
			}

			const { $props: props, state } = this;
			const keyword = e.target.value;
			const searching = keyword !== "";

			this.state.actived = true;
			this.state.searching = searching;
			this.state.keyword = keyword;
			this.state.options = searching ? this.getFilteredOptions(state, props) : [];
		},
		handleSelectionClear(e) {
			const { $props: props } = this;
			const keyword = "";
			const value = [];

			this.state.searching = false;
			this.state.keyword = keyword;
			this.state.value = value;
			this.state.options = [];
			this.$emit("input", value);
			this.$emit("change", value);

			if (props.validator) {
				this.dispatch("vui-form-item", "change", value);
			}
		},
		handleMenuListSelect(options) {
			const { $props: props } = this;
			const optionKeys = utils.getOptionKeys(props.optionKeys);
			const option = options[options.length - 1];
			const keyword = "";
			const value = options.map(option => option[optionKeys.value]);

			this.state.actived = option && option.children && option.children.length > 0;
			this.state.keyword = keyword;
			this.state.value = options;
			this.$emit("input", value);
			this.$emit("change", value);

			if (props.validator) {
				this.dispatch("vui-form-item", "change", value);
			}
		},
		handleMenuSelect(level, data) {
			const { $props: props } = this;
			const optionKeys = utils.getOptionKeys(props.optionKeys);
			const keyword = "";
			const value = data.path.map(option => option[optionKeys.value]);

			this.state.actived = false;
			this.state.keyword = keyword;
			this.state.value = data.path;
			this.$emit("input", value);
			this.$emit("change", value);

			if (props.validator) {
				this.dispatch("vui-form-item", "change", value);
			}
		}
	},
	render(h) {
		const { $vui: vui, vuiForm, vuiInputGroup, $slots: slots, $props: props, state, t: translate } = this;
		const { handleSelectionMouseenter, handleSelectionMouseleave, handleSelectionClick, handleSelectionFocus, handleSelectionBlur, handleSelectionKeydown, handleSelectionInput, handleSelectionClear } = this;
		const { handleDropdownBeforeOpen, handleDropdownAfterClose } = this;
		const { handleMenuListSelect, handleMenuSelect } = this;

		// size: self > vuiInputGroup > vuiForm > vui
		let size;

		if (props.size) {
			size = props.size;
		}
		else if (vuiInputGroup && vuiInputGroup.size) {
			size = vuiInputGroup.size;
		}
		else if (vuiForm && vuiForm.size) {
			size = vuiForm.size;
		}
		else if (vui && vui.size) {
			size = vui.size;
		}
		else {
			size = "medium";
		}

		// disabled: vuiForm > vuiInputGroup > self
		let disabled;

		if (vuiForm && vuiForm.disabled) {
			disabled = vuiForm.disabled;
		}
		else if (vuiInputGroup && vuiInputGroup.disabled) {
			disabled = vuiInputGroup.disabled;
		}
		else {
			disabled = props.disabled;
		}

		// optionKeys
		const optionKeys = utils.getOptionKeys(props.optionKeys);

		// options
		let options = [];

		if (state.searching) {
			options = state.options;
		}
		else {
			options = props.options;
		}

		// dropdownVisible
		const dropdownVisible = state.actived;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "cascader");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${size}`]: size,
			[`${classNamePrefix}-hovered`]: state.hovered,
			[`${classNamePrefix}-focused`]: state.focused,
			[`${classNamePrefix}-actived`]: state.actived,
			[`${classNamePrefix}-disabled`]: disabled
		};

		// render
		let menu;

		if (options.length === 0) {
			menu = (
				<VuiCascaderEmpty
					classNamePrefix={classNamePrefix}
					notFoundText={props.notFoundText}
				/>
			);
		}
		else {
			if (state.searching) {
				menu = (
					<VuiCascaderMenu
						classNamePrefix={classNamePrefix}
						value={state.value[state.value.length - 1]}
						options={options}
						optionKeys={optionKeys}
						dangerouslyUseHTMLString={true}
						onSelect={handleMenuSelect}
					/>
				);
			}
			else {
				menu = (
					<VuiCascaderMenuList
						classNamePrefix={classNamePrefix}
						value={state.value}
						options={options}
						optionKeys={optionKeys}
						expandTrigger={props.expandTrigger}
						changeOnSelect={props.changeOnSelect}
						onSelect={handleMenuListSelect}
					/>
				);
			}
		}

		return (
			<div class={classes.el}>
				<VuiCascaderSelection
					ref="selection"
					classNamePrefix={classNamePrefix}
					placeholder={props.placeholder || translate("vui.cascader.placeholder")}
					value={state.value}
					optionKeys={optionKeys}
					formatter={props.formatter}
					searchable={props.searchable}
					keyword={state.keyword}
					clearable={props.clearable}
					hovered={state.hovered}
					focused={props.searchable && state.actived}
					disabled={disabled}
					onMouseenter={handleSelectionMouseenter}
					onMouseleave={handleSelectionMouseleave}
					onClick={handleSelectionClick}
					onFocus={handleSelectionFocus}
					onBlur={handleSelectionBlur}
					onKeydown={handleSelectionKeydown}
					onInput={handleSelectionInput}
					onClear={handleSelectionClear}
				/>
				<VuiLazyRender status={dropdownVisible}>
					<VuiCascaderDropdown
						ref="dropdown"
						classNamePrefix={classNamePrefix}
						visible={dropdownVisible}
						placement={props.placement}
						autoWidth={props.dropdownAutoWidth}
						animation={props.animation}
						getPopupReference={this.getDropdownReference}
						getPopupContainer={props.getPopupContainer}
						onBeforeOpen={handleDropdownBeforeOpen}
						onAfterClose={handleDropdownAfterClose}
					>
						{menu}
					</VuiCascaderDropdown>
				</VuiLazyRender>
			</div>
		);
	}
};

export default VuiCascader;