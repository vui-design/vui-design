import VcSelectSelection from "./components/selection";
import VcSelectDropdown from "./components/dropdown";
import Emitter from "vui-design/mixins/emitter";
import Locale from "vui-design/mixins/locale";
import Portal from "vui-design/directives/portal";
import Popup from "vui-design/utils/popup";
import is from "vui-design/utils/is";
import getStyle from "vui-design/utils/getStyle";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import { filter, getFilteredOptions, getFlattenOptions, isArrayEqual, isExistedOption } from "./utils";

const VcSelect = {
	name: "vui-select",

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
			vcSelect: this
		};
	},

	components: {
		VcSelectSelection,
		VcSelectDropdown
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
			type: [String, Number, Array],
			default: undefined
		},
		backfillOptionProp: {
			type: String,
			default: "children"
		},
		options: {
			type: Array,
			default: () => []
		},
		multiple: {
			type: Boolean,
			default: false
		},
		maxTagCount: {
			type: Number,
			default: 0
		},
		maxTagPlaceholder: {
			type: Function,
			default: count => `+ ${count}`
		},
		allowCreate: {
			type: Boolean,
			default: false
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
		autoClearKeyword: {
			type: Boolean,
			default: true
		},
		clearable: {
			type: Boolean,
			default: false
		},
		disabled: {
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
		let defaultValue;

		if (this.multiple) {
			defaultValue = this.getSelectedOptionsByValue(this.value);
		}
		else {
			defaultValue = this.getSelectedOptionByValue(this.value);
		}

		return {
			hovered: false,
			focused: false,
			actived: false,
			defaultValue: defaultValue,
			keyword: "",
			hoveredOptionIndex: -1,
			hoveredOption: undefined
		};
	},

	computed: {
		filteredOptions() {
			let options = [];

			if (this.searchable && this.keyword && this.filter) {
				options = getFilteredOptions(this.keyword, this.options, this.filter, this.filterOptionProp);
			}
			else {
				options = [
					...this.options
				];
			}

			if (this.allowCreate && this.keyword && !isExistedOption(this.keyword, options)) {
				options.unshift({
					isOption: true,
					label: this.keyword,
					value: this.keyword,
					children: this.keyword
				});
			}

			return options;
		},
		flattenOptions() {
			return getFlattenOptions(this.filteredOptions);
		}
	},

	watch: {
		actived(next, prev) {
			if (next === prev || !next) {
				return;
			}

			this.$nextTick(() => {
				this.assignHoveredOption();
			});
		},
		value(next, prev) {
			let defaultValue;

			if (this.multiple) {
				defaultValue = this.getSelectedOptionsByValue(next, this.defaultValue);
			}
			else {
				defaultValue = this.getSelectedOptionByValue(next, this.defaultValue);
			}

			this.defaultValue = defaultValue;
		},
		options(next, prev) {
			let defaultValue;

			if (this.multiple) {
				defaultValue = this.getSelectedOptionsByValue(this.value, this.defaultValue);
			}
			else {
				defaultValue = this.getSelectedOptionByValue(this.value, this.defaultValue);
			}

			this.defaultValue = defaultValue;
		},
		defaultValue(next, prev) {
			this.$nextTick(() => {
				this.updatePopup();
			});
		},
		flattenOptions(next, prev) {
			next = next.map(element => element.value);
			prev = prev.map(element => element.value);

			if (isArrayEqual(next, prev)) {
				return;
			}

			this.$nextTick(() => {
				this.assignHoveredOption();
				this.updatePopup();
			});
		}
	},

	methods: {
		focus() {
			this.$refs.selection.focus();
		},
		blur() {
			this.$refs.selection.blur();
		},

		getSelectedOptionsByValue(value, defaultValue) {
			if (is.undefined(value)) {
				return [];
			}

			let options = [];

			if (is.array(value)) {
				value.forEach(element => {
					let option = this.getSelectedOptionByValue(element, defaultValue);

					if (!option) {
						return;
					}

					options.push(option);
				});
			}

			return options;
		},
		getSelectedOptionByValue(value, defaultValue) {
			if (is.undefined(value)) {
				return;
			}

			let options = getFlattenOptions(this.options);
			let option = options.find(element => element.value === value);

			if (option) {
				return {
					...option
				};
			}

			if (this.multiple) {
				if (defaultValue && defaultValue.length) {
					option = defaultValue.find(element => element.value === value);

					if (option) {
						return {
							...option
						};
					}
				}
			}
			else {
				option = defaultValue;

				if (option && option.value === value) {
					return {
						...option
					};
				}
			}

			return undefined;
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
			this.popup.target.style.minWidth = getStyle(reference, "width");
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

		assignHoveredOption() {
			if (this.loading) {
				return;
			}

			let options = this.flattenOptions;

			if (options.length === 0) {
				this.hoveredOptionIndex = -1;
				this.hoveredOption = undefined;
			}
			else {
				let enabled = options.filter(option => !option.disabled);
				let index = -1;
				let option = undefined;

				if (this.multiple) {
					let selected = enabled.filter(option => this.defaultValue.findIndex(item => item.value === option.value) > -1);

					if (selected.length) {
						let target = selected[0];

						index = options.findIndex(option => option.value === target.value);
						option = target;
					}
					else if (enabled.length) {
						let target = enabled[0];

						index = options.findIndex(option => option.value === target.value);
						option = target;
					}
				}
				else {
					let selected = enabled.find(option => this.defaultValue && this.defaultValue.value === option.value);

					if (selected) {
						index = options.findIndex(option => option.value === selected.value);
						option = selected;
					}
					else if (enabled.length) {
						let target = enabled[0];

						index = options.findIndex(option => option.value === target.value);
						option = target;
					}
				}

				this.hoveredOptionIndex = index;
				this.hoveredOption = option;
			}
		},
		changeHoveredOption(direction, lastIndex) {
			let { flattenOptions: options, hoveredOptionIndex } = this;

			if (!options.length) {
				return;
			}

			let index = (lastIndex === undefined ? hoveredOptionIndex : lastIndex) + direction;
			let min = 0;
			let max = options.length - 1;

			if (index < min) {
				index = max;
			}

			if (index > max) {
				index = min;
			}

			let option = options[index];

			if (option.disabled) {
				this.changeHoveredOption(direction, index);
			}
			else {
				this.hoveredOptionIndex = index;
				this.hoveredOption = option;
			}
		},

		handleSelectionMouseenter(e) {
			this.hovered = true;
			this.$emit("mouseenter", e);
		},
		handleSelectionMouseleave(e) {
			this.hovered = false;
			this.$emit("mouseleave", e);
		},
		handleSelectionClick(e) {
			this.actived = !this.actived;
		},
		handleSelectionFocus(e) {
			this.focused = true;
			this.$emit("focus", e);
		},
		handleSelectionBlur(e) {
			this.focused = false;
			this.actived = false;
			this.keyword = "";
			this.$emit("search", "");
			this.$emit("blur", e);
		},
		handleSelectionKeydown(e) {
			const keyCode = e.keyCode;

			if (this.actived && [13, 27, 38, 40].indexOf(keyCode) > -1) {
				e.preventDefault();

				switch(keyCode) {
					case 13:
						this.hoveredOption && this.handleOptionClick(this.hoveredOption);
						break;
					case 27:
						this.actived = false;
						break;
					case 38:
						this.changeHoveredOption(-1);
						break;
					case 40:
						this.changeHoveredOption(1);
						break;
				}
			}
			else if (!this.actived && [38, 40].indexOf(keyCode) !== -1) {
				e.preventDefault();
				this.actived = true;
			}

			if (keyCode === 8 && !e.target.value && this.multiple && this.searchable && this.defaultValue.length) {
				let defaultValue = this.defaultValue.filter(item => !item.disabled);
				let lastValue = defaultValue[defaultValue.length - 1];

				if (lastValue) {
					this.handleSelectionRemove(lastValue.value);
				}
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

			this.actived = true;
			this.keyword = e.target.value;
			this.$emit("search", e.target.value);
		},
		handleSelectionRemove(value) {
			let index = this.defaultValue.findIndex(item => item.value === value);

			this.defaultValue.splice(index, 1);
			this.$emit("input", this.defaultValue.map(item => item.value));
			this.$emit("change", this.defaultValue.map(item => item.value));
			this.dispatch("vui-form-item", "change", this.defaultValue.map(item => item.value));
		},
		handleSelectionClear(e) {
			if (this.multiple) {
				this.defaultValue = [];
				this.$emit("input", []);
				this.$emit("change", []);
				this.dispatch("vui-form-item", "change", []);
			}
			else {
				this.defaultValue = undefined;
				this.$emit("input", undefined);
				this.$emit("change", undefined);
				this.dispatch("vui-form-item", "change", undefined);
			}
		},

		handleDropdownBeforeEnter(el) {
			this.$nextTick(() => this.createPopup());
		},
		handleDropdownAfterLeave(el) {
			this.$nextTick(() => this.destroyPopup());
		},

		handleOptionHover(option) {
			let index = this.flattenOptions.findIndex(item => item.value === option.value);

			this.hoveredOptionIndex = index;
			this.hoveredOption = this.flattenOptions[index];
		},
		handleOptionClick(option) {
			if (this.multiple) {
				let index = this.defaultValue.findIndex(item => item.value === option.value);

				if (index === -1) {
					this.defaultValue.push({
						...option
					});
				}
				else {
					this.defaultValue.splice(index, 1);
				}

				if (this.searchable && this.autoClearKeyword) {
					this.keyword = "";
					this.$emit("search", this.keyword);
				}

				this.$emit("input", this.defaultValue.map(item => item.value));
				this.$emit("change", this.defaultValue.map(item => item.value));
				this.dispatch("vui-form-item", "change", this.defaultValue.map(item => item.value));
			}
			else {
				this.actived = false;
				this.defaultValue = {
					...option
				};
				this.keyword = "";
				this.$emit("search", this.keyword);
				this.$emit("input", this.defaultValue.value);
				this.$emit("change", this.defaultValue.value);
				this.dispatch("vui-form-item", "change", this.defaultValue.value);
			}
		}
	},

	render() {
		const { $vui: vui, vuiForm, vuiInputGroup } = this;
		const { t: translate, classNamePrefix: customizedClassNamePrefix, placeholder, keyword, defaultValue: value, backfillOptionProp, filteredOptions, flattenOptions, multiple, maxTagCount, maxTagPlaceholder, searchable, filter, loading, loadingText, notFoundText, clearable, hovered, focused, actived } = this;
		const { animation, getPopupContainer } = this;
		const { handleSelectionMouseenter, handleSelectionMouseleave, handleSelectionClick, handleSelectionFocus, handleSelectionBlur, handleSelectionKeydown, handleSelectionInput, handleSelectionRemove, handleSelectionClear } = this;
		const { handleDropdownBeforeEnter, handleDropdownAfterLeave, handleOptionHover, handleOptionClick } = this;
		const portal = getPopupContainer();

		// size: self > vuiInputGroup > vuiForm > vui
		let size;

		if (this.size) {
			size = this.size;
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
			disabled = this.disabled;
		}

		// show
		let show = actived;
		let notFound = !filteredOptions || filteredOptions.length === 0;

		if (searchable && filter === false && !loading && keyword === "" && notFound) {
			show = false;
		}

		// class
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "select");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-single`]: !multiple,
			[`${classNamePrefix}-multiple`]: multiple,
			[`${classNamePrefix}-${size}`]: size,
			[`${classNamePrefix}-hovered`]: hovered,
			[`${classNamePrefix}-focused`]: focused,
			[`${classNamePrefix}-actived`]: actived,
			[`${classNamePrefix}-disabled`]: disabled
		};

		// render
		return (
			<div class={classes.el}>
				<VcSelectSelection
					ref="selection"
					classNamePrefix={customizedClassNamePrefix}
					placeholder={placeholder || translate("vui.select.placeholder")}
					value={value}
					backfillOptionProp={backfillOptionProp}
					multiple={multiple}
					maxTagCount={maxTagCount}
					maxTagPlaceholder={maxTagPlaceholder}
					searchable={searchable}
					keyword={keyword}
					showInput={searchable && actived}
					clearable={clearable}
					disabled={disabled}
					onMouseenter={handleSelectionMouseenter}
					onMouseleave={handleSelectionMouseleave}
					onClick={handleSelectionClick}
					onFocus={handleSelectionFocus}
					onBlur={handleSelectionBlur}
					onKeydown={handleSelectionKeydown}
					onInput={handleSelectionInput}
					onRemove={handleSelectionRemove}
					onClear={handleSelectionClear}
				/>
				<transition name={animation} onBeforeEnter={handleDropdownBeforeEnter} onAfterLeave={handleDropdownAfterLeave} appear>
					<VcSelectDropdown
						ref="dropdown"
						v-portal={portal}
						v-show={show}
						classNamePrefix={customizedClassNamePrefix}
						options={filteredOptions}
						hoveredOption={this.hoveredOption}
						selectedOption={multiple ? undefined : value}
						selectedOptions={multiple ? value : undefined}
						multiple={multiple}
						loading={loading}
						loadingText={loadingText || translate("vui.select.loading")}
						notFoundText={notFoundText || translate("vui.select.notFound")}
						onOptionHover={handleOptionHover}
						onOptionClick={handleOptionClick}
					/>
				</transition>
			</div>
		);
	}
};

export default VcSelect;