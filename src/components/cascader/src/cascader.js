import VuiCascaderSelection from "./components/selection";
import VuiCascaderDropdown from "./components/dropdown";
import VuiCascaderMenuList from "./components/menu-list";
import VuiCascaderMenu from "./components/menu";
import Emitter from "vui-design/mixins/emitter";
import Locale from "vui-design/mixins/locale";
import Portal from "vui-design/directives/portal";
import Popup from "vui-design/utils/popup";
import is from "vui-design/utils/is";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import { getDerivedValueFromProps } from "./utils";

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
		VuiCascaderSelection,
		VuiCascaderDropdown,
		VuiCascaderMenuList,
		VuiCascaderMenu
	},

	mixins: [
		Emitter,
		Locale
	],

	directives: {
		Portal
	},

	model: {
		prop: "value",
		event: "input"
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		size: {
			type: String,
			default: undefined,
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		placeholder: {
			type: [String, Number],
			default: undefined
		},
		value: {
			type: Array,
			default: () => []
		},
		options: {
			type: Array,
			default: () => []
		},
		keyNames: {
			type: Object,
			default: () => ({ label: "label", value: "value", children: "children" })
		},
		formatter: {
			type: Function,
			default: (labels, options) => labels.join(" / ")
		},
		searchable: {
			type: Boolean,
			default: false
		},
		filter: {
			type: [Boolean, Function],
			default: true
		},
		filterOptionProp: {
			type: String,
			default: "children"
		},
		loading: {
			type: Boolean,
			default: false
		},
		loadingText: {
			type: String,
			default: undefined
		},
		notFoundText: {
			type: String,
			default: undefined
		},
		clearable: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		changeOnSelect: {
			type: Boolean,
			default: false
		},
		placement: {
			type: String,
			default: "bottom-start",
			validator: value => ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"].indexOf(value) > -1
		},
		animation: {
			type: String,
			default: "vui-select-dropdown-scale"
		},
		getPopupContainer: {
			type: Function,
			default: () => document.body
		}
	},

	data() {
		let { $props: props } = this;

		return {
			state: {
				hovered: false,
				focused: false,
				actived: false,
				keyword: "",
				value: getDerivedValueFromProps({
					value: props.value,
					options: props.options,
					keyName: props.keyNames.value
				})
			}
		};
	},

	watch: {
		value(value) {
			let { $props: props } = this;

			this.state.value = getDerivedValueFromProps({
				value,
				options: props.options,
				keyName: props.keyNames.value
			});
		},
		defaultValue(value) {
			this.$nextTick(() => this.updatePopup());
		},
		options(value) {
			let { $props: props } = this;

			this.state.value = getDerivedValueFromProps({
				value: props.value,
				options: value,
				keyName: props.keyNames.value
			});
		}
	},

	methods: {
		focus() {
			this.$refs.selection && this.$refs.selection.focus();
		},
		blur() {
			this.$refs.selection && this.$refs.selection.blur();
		},

		createPopup() {
			if (is.server || this.popup) {
				return;
			}

			let reference = this.$refs.selection.$el;
			let target = this.$refs.dropdown.$el;
			let settings = {
				placement: this.placement
			};

			if (!reference || !target || !settings.placement) {
				return;
			}

			this.popup = new Popup(reference, target, settings);
			this.popup.target.style.zIndex = Popup.nextZIndex();
		},
		updatePopup() {
			if (is.server || !this.popup) {
				return;
			}

			this.popup.update();
		},
		destroyPopup() {
			if (is.server || !this.popup) {
				return;
			}

			this.popup.destroy();
			this.popup = null;
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
			this.state.actived = !this.state.actived;
		},
		handleSelectionFocus(e) {
			this.state.focused = true;
			this.$emit("focus", e);
		},
		handleSelectionBlur(e) {
			let keyword = "";

			this.state.focused = false;
			this.state.actived = false;
			this.state.keyword = keyword;
			this.$emit("search", keyword);
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
				this.isComposition = true;
			}
			else if (/^composition(end)?$/g.test(e.type)) {
				this.isComposition = false;
			}

			if (this.isComposition) {
				return;
			}

			let keyword = e.target.value;

			this.state.actived = true;
			this.state.keyword = keyword;
			this.$emit("search", keyword);
		},
		handleSelectionClear(e) {
			let value = [];

			this.state.value = value;
			this.$emit("input", value);
			this.$emit("change", value);
			this.dispatch("vui-form-item", "change", value);
		},

		handleDropdownBeforeEnter(e) {
			this.$nextTick(() => this.createPopup());
		},
		handleDropdownAfterLeave(e) {
			this.$nextTick(() => this.destroyPopup());
		},

		handleMenuListSelect(options) {
			let { $props: props } = this;
			let lastOption = options[options.length - 1];
			let keyword = "";
			let value = options.map(option => option[props.keyNames.value]);

			this.state.actived = lastOption && lastOption.children && lastOption.children.length > 0;
			this.state.keyword = keyword;
			this.state.value = options;

			this.$emit("search", keyword);
			this.$emit("input", value);
			this.$emit("change", value);
			this.dispatch("vui-form-item", "change", value);
		}
	},

	render(h) {
		const { $vui: vui, vuiForm, vuiInputGroup } = this;
		const { $slots: slots, t: translate, state, $props: props } = this;
		const { handleSelectionMouseenter, handleSelectionMouseleave, handleSelectionClick, handleSelectionFocus, handleSelectionBlur, handleSelectionKeydown, handleSelectionInput, handleSelectionClear } = this;
		const { handleDropdownBeforeEnter, handleDropdownAfterLeave, handleOptionHover, handleOptionClick } = this;
		const { handleMenuListSelect } = this;
		const portal = props.getPopupContainer();

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

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "cascader");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${size}`]: size,
			[`${classNamePrefix}-hovered`]: state.hovered,
			[`${classNamePrefix}-focused`]: state.focused,
			[`${classNamePrefix}-actived`]: state.actived,
			[`${classNamePrefix}-disabled`]: disabled
		};













		// dropdownVisible
		let dropdownVisible = state.actived;
		let notFound = props.options.length === 0;

		if (props.searchable && props.filter === false && !props.loading && state.keyword === "" && notFound) {
			dropdownVisible = false;
		}

		// showMenuList
		let showMenuList = props.options.length > 0 && (!props.searchable || (props.searchable && state.keyword === ""));

		// render
		return (
			<div class={classes.el}>
				<VuiCascaderSelection
					ref="selection"
					classNamePrefix={props.classNamePrefix}
					placeholder={props.placeholder || translate("vui.cascader.placeholder")}
					value={state.value}
					keyNames={props.keyNames}
					formatter={props.formatter}
					searchable={props.searchable}
					keyword={state.keyword}
					clearable={props.clearable}
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
				<transition
					name={props.animation}
					onBeforeEnter={handleDropdownBeforeEnter}
					onAfterLeave={handleDropdownAfterLeave}
					appear
				>
					<VuiCascaderDropdown
						ref="dropdown"
						v-portal={portal}
						v-show={dropdownVisible}
						classNamePrefix={props.classNamePrefix}
					>
						{
							showMenuList && (
								<VuiCascaderMenuList
									classNamePrefix={props.classNamePrefix}
									value={state.value}
									options={props.options}
									keyNames={props.keyNames}
									changeOnSelect={props.changeOnSelect}
									visible={dropdownVisible}
									onSelect={handleMenuListSelect}
								/>
							)
						}
					</VuiCascaderDropdown>
				</transition>
			</div>
		);
	}
};

export default VuiCascader;