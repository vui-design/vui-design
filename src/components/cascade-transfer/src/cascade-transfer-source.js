import VuiCheckbox from "../../checkbox";
import VuiInput from "../../input";
import VuiIcon from "../../icon";
import VuiBadge from "../../badge";
import VuiCascadeTransferEmpty from "./cascade-transfer-empty";
import Locale from "../../../mixins/locale";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import clone from "../../../utils/clone";
import flatten from "../../../utils/flatten";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";
import utils from "./utils";

const VuiCascadeTransferSource = {
  name: "vui-cascade-transfer-source",
  components: {
    VuiCheckbox,
    VuiInput,
    VuiIcon,
    VuiBadge,
    VuiCascadeTransferEmpty
  },
  mixins: [
    Locale
  ],
  props: {
    classNamePrefix: PropTypes.string,
    level: PropTypes.number.def(1),
    parent: PropTypes.object,
    selectedKeys: PropTypes.array.def([]),
    options: PropTypes.array.def([]),
    valueKey: PropTypes.string.def("value"),
    childrenKey: PropTypes.string.def("children"),
    title: PropTypes.func.def(props => ""),
    formatter: PropTypes.func.def(option => option.label),
    showSelectAll: PropTypes.bool.def(true),
    showChildrenCount: PropTypes.bool.def(false),
    searchable: PropTypes.bool.def(false),
    filterOptionProp: PropTypes.string.def("label"),
    filter: PropTypes.func,
    disabled: PropTypes.bool.def(false),
    locale: PropTypes.object
  },
  data() {
    const state = {
      keyword: "",
      expandedKey: undefined
    };

    return {
      state
    };
  },
  methods: {
    getHeader(props) {
      // class
      const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "source-header");
      let classes = {};

      classes.el = `${classNamePrefix}`;
      classes.elCheckbox = `${classNamePrefix}-checkbox`;
      classes.elTitle = `${classNamePrefix}-title`;

      // title
      const title = props.title({
        type: props.type,
        level: props.level,
        parent: props.parent
      });

      // render
      let content = [];

      if (props.showSelectAll) {
        const indeterminate = utils.getIndeterminateStatus(props.selectedKeys, props.options, props.valueKey, props.childrenKey);
        const checked = utils.getCheckedStatus(props.selectedKeys, props.options, props.valueKey);
        const disabled = props.disabled;
        const onChange = checked => {
          if (props.parent) {
            checked ? props.onSelect(props.parent) : props.onDeselect(props.parent);
          }
          else {
            const options = flatten(props.options, props.childrenKey, true);

            if (checked) {
              props.onSelectAll(options.map(option => option[props.valueKey]));
            }
            else {
              props.onSelectAll([]);
            }
          }
        };

        content.push(
          <div class={classes.elCheckbox}>
            <VuiCheckbox checked={checked} indeterminate={indeterminate} disabled={disabled} validator={false} onChange={onChange} />
          </div>
        );
      }

      content.push(
        <div class={classes.elTitle}>
          {title}
        </div>
      );

      return (
        <div class={classes.el}>
          {content}
        </div>
      );
    },
    getSearch(props) {
      if (!props.searchable) {
        return;
      }

      // placeholder
      let placeholder;

      if (props.locale && props.locale.search) {
        placeholder = props.locale.search;
      }
      else {
        placeholder = this.t("vui.cascadeTransfer.search");
      }

      // class
      const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "source-search");
      let classes = {};

      classes.el = `${classNamePrefix}`;

      // render
      return (
        <div class={classes.el}>
          <VuiInput suffix="search" value={props.keyword} placeholder={placeholder} clearable validator={false} onInput={props.onSearch} />
        </div>
      );
    },
    getBody(props) {
      // class
      const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "source-body");
      let classes = {};

      classes.el = `${classNamePrefix}`;

      // render
      let content;

      if (props.options.length) {
        content = this.getMenu(props);
      }
      else {
        content = (
          <VuiCascadeTransferEmpty
            classNamePrefix={props.classNamePrefix}
            description={props.locale ? props.locale.notFound : undefined}
          />
        );
      }

      return (
        <div class={classes.el}>
          {content}
        </div>
      );
    },
    getMenu(props) {
      // class
      const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "menu");
      let classes = {};

      classes.el = `${classNamePrefix}`;

      // render
      return (
        <div class={classes.el}>
          {
            props.options.map(option => {
              const attributes = {
                classNamePrefix: classNamePrefix,
                type: props.type,
                level: props.level,
                parent: props.parent,
                option: option,
                valueKey: props.valueKey,
                childrenKey: props.childrenKey,
                formatter: props.formatter,
                expanded: props.expandedKey === option[props.valueKey],
                indeterminate: utils.getIndeterminateStatus(props.selectedKeys, option[props.childrenKey], props.valueKey, props.childrenKey),
                checked: props.selectedKeys.indexOf(option[props.valueKey]) > -1,
                disabled: props.disabled,
                showChildrenCount: props.showChildrenCount,
                onClick: props.onClick,
                onSelect: props.onSelect,
                onDeselect: props.onDeselect
              };

              return this.getMenuItem(attributes);
            })
          }
        </div>
      );
    },
    getMenuItem(props) {
      // class
      const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "item");
      let classes = {};

      classes.el = {
        [`${classNamePrefix}`]: true,
        [`${classNamePrefix}-expanded`]: props.expanded,
        [`${classNamePrefix}-indeterminate`]: props.indeterminate,
        [`${classNamePrefix}-checked`]: props.checked,
        [`${classNamePrefix}-disabled`]: props.disabled
      };
      classes.elCheckbox = `${classNamePrefix}-checkbox`;
      classes.elLabel = `${classNamePrefix}-label`;
      classes.elCount = `${classNamePrefix}-count`;
      classes.elArrow = `${classNamePrefix}-arrow`;

      // content
      let content;

      if (is.function(props.formatter)) {
        const attributes = {
          type: props.type,
          level: props.level,
          parent: props.parent,
          option: props.option
        };

        content = props.formatter(attributes);
      }
      else {
        content = props.option[props.valueKey];
      }

      // onStopPropagation
      const onStopPropagation = e => e.stopPropagation();

      // onClick
      const onClick = e => {
        props.onClick(props.option, props.level);
      };

      // onChange
      const onChange = checked => {
        checked ? props.onSelect(props.option) : props.onDeselect(props.option);
      };

      // render
      let children = [];

      children.push(
        <div class={classes.elCheckbox} onClick={onStopPropagation}>
          <VuiCheckbox indeterminate={props.indeterminate} checked={props.checked} disabled={props.disabled} onChange={onChange} />
        </div>
      );

      children.push(
        <div class={classes.elLabel}>
          {content}
        </div>
      );

      if (props.option[props.childrenKey] && props.option[props.childrenKey].length > 0) {
        if (props.showChildrenCount) {
          children.push(
            <div class={classes.elCount}>
              <VuiBadge type="default" count={props.option[props.childrenKey].length} />
            </div>
          );
        }

        children.push(
          <div class={classes.elArrow}>
            <VuiIcon type="chevron-right" />
          </div>
        );
      }

      return (
        <div class={classes.el} onClick={onClick}>
          {children}
        </div>
      );
    },
    handleSearch(value) {
      this.state.keyword = value;
    },
    handleClick(option, level) {
      const { $props: props } = this;

      this.state.expandedKey = option[props.valueKey];
      this.$emit("click", option, level);
    },
    handleSelectAll(selectedKeys) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.$emit("selectAll", selectedKeys);
    },
    handleSelect(option) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.$emit("select", option);
    },
    handleDeselect(option) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.$emit("deselect", option);
    }
  },
  render(h) {
    const { $props: props, state } = this;
    const { handleSearch, handleClick, handleSelectAll, handleSelect, handleDeselect } = this;

    // options
    let options = props.options;

    if (props.searchable && state.keyword) {
      options = utils.getFilteredOptions(options, state.keyword, props.filter, props.filterOptionProp);
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "source");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    // render
    const attributes = {
      type: "source",
      classNamePrefix: props.classNamePrefix,
      level: props.level,
      parent: props.parent,
      expandedKey: state.expandedKey,
      selectedKeys: props.selectedKeys,
      options: options,
      valueKey: props.valueKey,
      childrenKey: props.childrenKey,
      title: props.title,
      formatter: props.formatter,
      showSelectAll: props.showSelectAll,
      showChildrenCount: props.showChildrenCount,
      searchable: props.searchable,
      filterOptionProp: props.filterOptionProp,
      filter: props.filter,
      disabled: props.disabled,
      locale: props.locale,
      onSearch: handleSearch,
      onClick: handleClick,
      onSelectAll: handleSelectAll,
      onSelect: handleSelect,
      onDeselect: handleDeselect
    };

    return (
      <div class={classes.el}>
        {this.getHeader(attributes)}
        {this.getSearch(attributes)}
        {this.getBody(attributes)}
      </div>
    );
  }
};

export default VuiCascadeTransferSource;