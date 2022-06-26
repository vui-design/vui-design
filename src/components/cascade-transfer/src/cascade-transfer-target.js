import VuiInput from "../../input";
import VuiIcon from "../../icon";
import VuiCascadeTransferEmpty from "./cascade-transfer-empty";
import Locale from "../../../mixins/locale";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import clone from "../../../utils/clone";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";
import utils from "./utils";

const VuiCascadeTransferTarget = {
  name: "vui-cascade-transfer-target",
  components: {
    VuiInput,
    VuiIcon,
    VuiCascadeTransferEmpty
  },
  mixins: [
    Locale
  ],
  props: {
    classNamePrefix: PropTypes.string,
    title: PropTypes.func.def(props => ""),
    value: PropTypes.array.def([]),
    options: PropTypes.array.def([]),
    valueKey: PropTypes.string.def("value"),
    childrenKey: PropTypes.string.def("children"),
    formatter: PropTypes.func.def(option => option.label),
    showClear: PropTypes.bool.def(true),
    searchable: PropTypes.bool.def(false),
    filterOptionProp: PropTypes.string.def("label"),
    filter: PropTypes.func,
    disabled: PropTypes.bool.def(false),
    locale: PropTypes.object
  },
  data() {
    const state = {
      keyword: ""
    };

    return {
      state
    };
  },
  methods: {
    getHeader(props) {
      // class
      const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "target-header");
      let classes = {};

      classes.el = `${classNamePrefix}`;
      classes.elTitle = `${classNamePrefix}-title`;
      classes.elExtra = `${classNamePrefix}-extra`;

      // title
      const title = props.title({
        type: props.type
      });

      // render
      let content = [];

      content.push(
        <div class={classes.elTitle}>
          {title}
        </div>
      );

      if (!props.disabled && props.showClear) {
        let btnClearText;

        if (props.locale && props.locale.clear) {
          btnClearText = props.locale.clear;
        }
        else {
          btnClearText = this.t("vui.cascadeTransfer.clear");
        }

        content.push(
          <div class={classes.elExtra}>
            <a href="javascript:;" onClick={props.onClear}>
              {btnClearText}
            </a>
          </div>
        );
      }

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

      // class
      const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "target-search");
      let classes = {};

      classes.el = `${classNamePrefix}`;

      // placeholder
      let placeholder;

      if (props.locale && props.locale.search) {
        placeholder = props.locale.search;
      }
      else {
        placeholder = this.t("vui.cascadeTransfer.search");
      }

      // render
      return (
        <div class={classes.el}>
          <VuiInput suffix="search" value={props.keyword} placeholder={placeholder} clearable validator={false} onInput={props.onSearch} />
        </div>
      );
    },
    getBody(props) {
      // class
      const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "target-body");
      let classes = {};

      classes.el = `${classNamePrefix}`;

      // notFoundText
      let notFoundText;

      if (props.locale && props.locale.notFound) {
        notFoundText = props.locale.notFound;
      }

      // render
      let content;

      if (props.value.length) {
        content = this.getChoice(props);
      }
      else {
        content = (
          <VuiCascadeTransferEmpty
            classNamePrefix={props.classNamePrefix}
            description={notFoundText}
          />
        );
      }

      return (
        <div class={classes.el}>
          {content}
        </div>
      );
    },
    getChoice(props) {
      // class
      const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "choice");
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
                valueKey: props.valueKey,
                childrenKey: props.childrenKey,
                option: option,
                formatter: props.formatter,
                disabled: props.disabled,
                onDeselect: props.onDeselect
              };

              return this.getChoiceItem(attributes);
            })
          }
        </div>
      );
    },
    getChoiceItem(props) {
      // class
      const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "item");
      let classes = {};

      classes.el = {
        [`${classNamePrefix}`]: true,
        [`${classNamePrefix}-disabled`]: props.disabled
      };
      classes.elLabel = `${classNamePrefix}-label`;
      classes.elBtnDeselect = `${classNamePrefix}-btn-deselect`;

      // content
      let content;

      if (is.function(props.formatter)) {
        const attributes = {
          type: props.type,
          option: props.option
        };

        content = props.formatter(attributes);
      }
      else {
        content = props.option[props.valueKey];
      }

      // onDeselect
      const onDeselect = e => {
        props.onDeselect(props.option);
      };

      // render
      let children = [];

      children.push(
        <div class={classes.elLabel}>
          {content}
        </div>
      );

      if (!props.disabled) {
        children.push(
          <div class={classes.elBtnDeselect} onClick={onDeselect}>
            <VuiIcon type="crossmark" />
          </div>
        );
      }

      return (
        <div class={classes.el}>
          {children}
        </div>
      );
    },
    handleSearch(value) {
      this.state.keyword = value;
    },
    handleDeselect(option) {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.$emit("deselect", option);
    },
    handleClear() {
      const { $props: props } = this;

      if (props.disabled) {
        return;
      }

      this.$emit("clear");
    }
  },
  render(h) {
    const { $props: props, state } = this;
    const { handleSearch, handleDeselect, handleClear } = this;

    // options
    let options = utils.getSelectedOptions(props.value, props.options, props.valueKey, props.childrenKey);

    if (props.searchable && state.keyword) {
      options = utils.getFilteredOptions(options, state.keyword, props.filter, props.filterOptionProp);
    }

    // class
    const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "target");
    let classes = {};

    classes.el = `${classNamePrefix}`;

    // render
    const attributes = {
      type: "target",
      classNamePrefix: props.classNamePrefix,
      title: props.title,
      value: props.value,
      options: options,
      valueKey: props.valueKey,
      childrenKey: props.childrenKey,
      formatter: props.formatter,
      showClear: props.showClear,
      searchable: props.searchable,
      filterOptionProp: props.filterOptionProp,
      filter: props.filter,
      disabled: props.disabled,
      locale: props.locale,
      onSearch: handleSearch,
      onDeselect: handleDeselect,
      onClear: handleClear
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

export default VuiCascadeTransferTarget;