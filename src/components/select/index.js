import VuiSelect from "./src/select";
import PropTypes from "vui-design/utils/prop-types";
import utils from "./src/utils";

const valueProp = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
const VuiSelectWrapper = {
  name: VuiSelect.name,
  components: {
    VuiSelect
  },
  model: {
    prop: "value",
    event: "input"
  },
  props: {
    classNamePrefix: PropTypes.string,
    size: PropTypes.oneOf(["small", "medium", "large"]),
    placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([valueProp, PropTypes.arrayOf(valueProp)]),
    backfillOptionProp: PropTypes.string.def("children"),
    multiple: PropTypes.bool.def(false),
    maxTagCount: PropTypes.number.def(0),
    maxTagPlaceholder: PropTypes.func.def(count => "+" + count),
    searchable: PropTypes.bool.def(false),
    filter: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]).def(true),
    filterOptionProp: PropTypes.string.def("children"),
    allowCreate: PropTypes.bool.def(false),
    loading: PropTypes.bool.def(false),
    loadingText: PropTypes.string,
    notFoundText: PropTypes.string,
    clearKeywordOnSelect: PropTypes.bool.def(true),
    clearable: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    placement: PropTypes.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"]).def("bottom-start"),
    animation: PropTypes.string.def("vui-select-dropdown-scale"),
    dropdownClassName: PropTypes.string,
    dropdownAutoWidth: PropTypes.bool.def(true),
    getPopupContainer: PropTypes.func.def(() => document.body),
    beforeSelect: PropTypes.func,
    beforeDeselect: PropTypes.func,
    validator: PropTypes.bool.def(true)
  },
  methods: {
    focus() {
      this.$refs.select.focus();
    },
    blur() {
      this.$refs.select.blur();
    }
  },
  render() {
    const { $slots: slots, $listeners: listeners, $props: props } = this;
    const attributes = {
      ref: "select",
      props: {
        ...props,
        options: utils.getOptionsFromChildren(slots.default)
      },
      on: listeners
    };

    return (
      <VuiSelect {...attributes} />
    );
  }
};

VuiSelectWrapper.install = function(Vue) {
  Vue.component(VuiSelectWrapper.name, VuiSelectWrapper);
};

export default VuiSelectWrapper;