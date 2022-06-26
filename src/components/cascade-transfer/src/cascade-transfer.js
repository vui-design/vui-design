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
    checkedStrategy: PropTypes.oneOf(["all", "parent", "children"]).def("all"),
    showTargetPanel: PropTypes.bool.def(true),
    showSelectAll: PropTypes.bool.def(true),
    showClear: PropTypes.bool.def(true),
    showChildrenCount: PropTypes.bool.def(false),
    searchable: PropTypes.bool.def(false),
    filterOptionProp: PropTypes.string.def("label"),
    filter: PropTypes.func,
    disabled: PropTypes.bool.def(false),
    validator: PropTypes.bool.def(true),
    locale: PropTypes.object
  },
  data() {
    const { $props: props } = this;
    const selectedKeys = utils.getSelectedKeysByValue(props.value, props);
    const sourceList = [
      {
        parent: undefined,
        options: props.options
      }
    ];

    return {
      state: {
        selectedKeys: selectedKeys,
        value: clone(props.value),
        sourceList: sourceList
      }
    };
  },
  watch: {
    value(value) {
      const { $props: props } = this;
      const selectedKeys = utils.getSelectedKeysByValue(value, props);

      this.state.selectedKeys = selectedKeys;
      this.state.value = clone(value);
    },
    options(value) {
      const { $props: props } = this;
      const selectedKeys = utils.getSelectedKeysByValue(props.value, props);
      const sourceList = [
        {
          parent: undefined,
          options: value
        }
      ];

      this.state.selectedKeys = selectedKeys;
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
      const children = option[props.childrenKey];

      if (children && children.length > 0) {
        const sourceList = this.state.sourceList.slice(0, level);
        const source = {
          parent: option,
          options: children
        };

        this.state.sourceList = sourceList.concat(source);
      }
      else {
        this.state.sourceList = this.state.sourceList.slice(0, level);
      }

      this.$emit("click", option);
    },
    handleSelectAll(selectedKeys) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.state.selectedKeys = selectedKeys;
      this.handleChange();
    },
    handleSelect(option) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      let selectedKeys = clone(this.state.selectedKeys);
      const value = option[props.valueKey];
      const index = selectedKeys.indexOf(value);

      if (index === -1) {
        selectedKeys.push(value);
      }

      this.upward(true, option, selectedKeys);
      this.downward(true, option, selectedKeys);

      this.state.selectedKeys = selectedKeys;
      this.handleChange();
    },
    handleDeselect(option) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      let selectedKeys = clone(this.state.selectedKeys);
      const value = option[props.valueKey];
      const index = selectedKeys.indexOf(value);

      if (index > -1) {
        selectedKeys.splice(index, 1);
      }

      this.upward(false, option, selectedKeys);
      this.downward(false, option, selectedKeys);

      this.state.selectedKeys = selectedKeys;
      this.handleChange();
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

      const value = utils.getValueBySelectedKeys(this.state.selectedKeys, props.options, props.valueKey, props.childrenKey, props.checkedStrategy);

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
                formatter={formatter}
                showSelectAll={props.showSelectAll}
                showChildrenCount={props.showChildrenCount}
                searchable={props.searchable}
                filterOptionProp={props.filterOptionProp}
                filter={props.filter}
                disabled={props.disabled}
                locale={props.locale}
                onClick={handleClick}
                onSelectAll={handleSelectAll}
                onSelect={handleSelect}
                onDeselect={handleDeselect}
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
          value={state.value}
          options={props.options}
          valueKey={props.valueKey}
          childrenKey={props.childrenKey}
          title={props.title}
          formatter={formatter}
          showClear={props.showClear}
          searchable={props.searchable}
          filterOptionProp={props.filterOptionProp}
          filter={props.filter}
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