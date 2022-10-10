import VuiCascaderSelection from "./cascader-selection";
import VuiCascaderDropdown from "./cascader-dropdown";
import VuiCascaderEmpty from "./cascader-empty";
import VuiCascaderMenuList from "./cascader-menu-list";
import VuiCascaderMenu from "./cascader-menu";
import Emitter from "../../../mixins/emitter";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import clone from "../../../utils/clone";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";
import utils from "./utils";

export const createProps = () => {
  return {
    classNamePrefix: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.array.def([]),
    options: PropTypes.array.def([]),
    expandTrigger: PropTypes.oneOf(["click", "hover"]).def("click"),
    optionKeys: PropTypes.object.def(utils.optionKeys),
    formatter: PropTypes.func.def((labels, options) => labels.join(" / ")),
    changeOnSelect: PropTypes.bool.def(false),
    bordered: PropTypes.bool.def(true),
    searchable: PropTypes.bool.def(false),
    filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).def(true),
    filterOptionProp: PropTypes.string.def("label"),
    notFoundText: PropTypes.string,
    clearable: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    placement: PropTypes.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"]).def("bottom-start"),
    animation: PropTypes.string.def("vui-cascader-dropdown-scale"),
    dropdownClassName: PropTypes.string,
    dropdownAutoWidth: PropTypes.bool.def(true),
    getPopupContainer: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]).def(() => document.body),
    beforeSelect: PropTypes.func,
    validator: PropTypes.bool.def(true)
  };
};

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
    VuiCascaderEmpty,
    VuiCascaderMenuList,
    VuiCascaderMenu
  },
  mixins: [
    Emitter
  ],
  model: {
    prop: "value",
    event: "input"
  },
  props: createProps(),
  data() {
    const { $props: props } = this;
    const optionKeys = utils.getOptionKeys(props.optionKeys);
    const state = {
      hovered: false,
      focused: false,
      actived: false,
      searching: false,
      keyword: "",
      value: this.getValue({
        value: props.value,
        options: props.options,
        optionKeys: optionKeys
      }),
      options: []
    };

    return {
      state
    };
  },
  watch: {
    value(value) {
      const { $props: props } = this;
      const optionKeys = utils.getOptionKeys(props.optionKeys);

      this.state.value = this.getValue({
        value: value,
        options: props.options,
        optionKeys: optionKeys
      });
    },
    options(value) {
      const { $props: props } = this;
      const optionKeys = utils.getOptionKeys(props.optionKeys);

      this.state.value = this.getValue({
        value: props.value,
        options: value,
        optionKeys: optionKeys
      });
    }
  },
  methods: {
    getValue(props) {
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
          result = result.concat(this.getValue({
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
    getPopupReference() {
      return this.$refs.selection.$el;
    },
    focus() {
      this.$refs.selection && this.$refs.selection.focus();
    },
    blur() {
      this.$refs.selection && this.$refs.selection.blur();
    },
    handleMouseenter(e) {
      this.state.hovered = true;
      this.$emit("mouseenter", e);
    },
    handleMouseleave(e) {
      this.state.hovered = false;
      this.$emit("mouseleave", e);
    },
    handleClick(e) {
      const { $props: props, state } = this;

      this.state.actived = props.searchable ? true : !state.actived;
    },
    handleFocus(e) {
      this.state.focused = true;
      this.$emit("focus", e);
    },
    handleBlur(e) {
      const keyword = "";

      this.state.focused = false;
      this.state.actived = false;
      this.state.keyword = keyword;
      this.$emit("blur", e);
    },
    handleKeydown(e) {
      const keyCode = e.keyCode;

      if (!this.state.actived && [38, 40].indexOf(keyCode) > -1) {
        e.preventDefault();
        this.state.actived = true;
      }
    },
    handleInput(e) {
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
    handleClear(e) {
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
    handleResize(e) {
      const callback = () => {
        if (!this.$refs.dropdown) {
          return;
        }

        this.$refs.dropdown.reregister();
      }

      this.$nextTick(callback);
    },
    handleBeforeOpen() {
      this.$emit("beforeOpen");
    },
    handleAfterOpen() {
      this.$emit("afterOpen");
    },
    handleBeforeClose() {
      this.$emit("beforeClose");
    },
    handleAfterClose() {
      this.state.searching = false;
      this.state.options = [];
      this.$emit("afterClose");
    },
    handleMenuListSelect(options) {
      const { $props: props } = this;
      const optionKeys = utils.getOptionKeys(props.optionKeys);
      const option = options[options.length - 1];
      const keyword = "";
      const value = options.map(option => option[optionKeys.value]);
      const callback = () => {
        this.state.actived = option && option.children && option.children.length > 0;
        this.state.keyword = keyword;
        this.state.value = options;
        this.$emit("input", value);
        this.$emit("change", value);

        if (props.validator) {
          this.dispatch("vui-form-item", "change", value);
        }
      };

      let hook = true;

      if (is.function(props.beforeSelect)) {
        hook = props.beforeSelect(value, options);
      }

      if (is.boolean(hook) && hook === false) {
        return;
      }

      if (is.promise(hook)) {
        hook.then(() => callback()).catch(error => {});
      }
      else {
        callback();
      }
    },
    handleMenuSelect(level, data) {
      const { $props: props } = this;
      const optionKeys = utils.getOptionKeys(props.optionKeys);
      const keyword = "";
      const value = data.path.map(option => option[optionKeys.value]);
      const callback = () => {
        this.state.actived = false;
        this.state.keyword = keyword;
        this.state.value = data.path;
        this.$emit("input", value);
        this.$emit("change", value);

        if (props.validator) {
          this.dispatch("vui-form-item", "change", value);
        }
      };

      let hook = true;

      if (is.function(props.beforeSelect)) {
        hook = props.beforeSelect(value, data.path);
      }

      if (is.boolean(hook) && hook === false) {
        return;
      }

      if (is.promise(hook)) {
        hook.then(() => callback()).catch(error => {});
      }
      else {
        callback();
      }
    }
  },
  render(h) {
    const { vuiForm, vuiInputGroup, $props: props, state } = this;
    const { handleMouseenter, handleMouseleave, handleClick, handleFocus, handleBlur, handleKeydown, handleInput, handleClear, handleResize } = this;
    const { handleBeforeOpen, handleAfterOpen, handleBeforeClose, handleAfterClose } = this;
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

    // dropdownAutoWidth
    let dropdownAutoWidth = props.dropdownAutoWidth;

    if (options.length === 0) {
      dropdownAutoWidth = false;
    }
    else if (state.searching === false) {
      dropdownAutoWidth = true;
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "cascader");
    let classes = {};

    classes.el = {
      [`${classNamePrefix}`]: true,
      [`${classNamePrefix}-${size}`]: size,
      [`${classNamePrefix}-bordered`]: props.bordered,
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
    else if (state.searching) {
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

    return (
      <div class={classes.el}>
        <VuiCascaderSelection
          ref="selection"
          classNamePrefix={classNamePrefix}
          placeholder={props.placeholder}
          value={state.value}
          optionKeys={optionKeys}
          formatter={props.formatter}
          searchable={props.searchable}
          keyword={state.keyword}
          clearable={props.clearable}
          hovered={state.hovered}
          focused={props.searchable && state.actived}
          disabled={disabled}
          onMouseenter={handleMouseenter}
          onMouseleave={handleMouseleave}
          onClick={handleClick}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeydown={handleKeydown}
          onInput={handleInput}
          onClear={handleClear}
          onResize={handleResize}
        />
        <VuiCascaderDropdown
          ref="dropdown"
          classNamePrefix={classNamePrefix}
          visible={dropdownVisible}
          class={props.dropdownClassName}
          placement={props.placement}
          autoWidth={dropdownAutoWidth}
          animation={props.animation}
          getPopupReference={this.getPopupReference}
          getPopupContainer={props.getPopupContainer}
          onBeforeOpen={handleBeforeOpen}
          onAfterOpen={handleAfterOpen}
          onBeforeClose={handleBeforeClose}
          onAfterClose={handleAfterClose}
        >
          {menu}
        </VuiCascaderDropdown>
      </div>
    );
  }
};

export default VuiCascader;