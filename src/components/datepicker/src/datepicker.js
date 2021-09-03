import Emitter from "../../../mixins/emitter";
import PropTypes from "../../../utils/prop-types";
import DatePicker from "vue2-datepicker";
import "vue2-datepicker/locale/zh-cn";

const VuiDatepicker = {
  name: "vui-datepicker",
  components: {
    DatePicker
  },
  mixins: [
    Emitter
  ],
  props: {
    classNamePrefix: PropTypes.string,
    type: PropTypes.string.def("date"),
    range: PropTypes.bool.def(false),
    format: PropTypes.string.def("YYYY-MM-DD"),
    formatter: PropTypes.object,
    valueType: PropTypes.string.def("format"),
    defaultValue: PropTypes.object,
    value: {},
    lang: PropTypes.object,
    placeholder: PropTypes.string.def(""),
    editable: PropTypes.bool.def(true),
    clearable: PropTypes.bool.def(true),
    confirm: PropTypes.bool.def(false),
    confirmText: PropTypes.string.def("OK"),
    multiple: PropTypes.bool.def(false),
    disabled: PropTypes.bool.def(false),
    disabledDate: PropTypes.func,
    disabledTime: PropTypes.func,
    appendToBody: PropTypes.bool.def(true),
    inline: PropTypes.bool.def(false),
    inputClass: PropTypes.string.def("mx-datepicker-input"),
    inputAttr: PropTypes.object,
    open: PropTypes.bool,
    defaultPanel: PropTypes.string,
    popupStyle: PropTypes.object,
    popupClass: {},
    shortcuts: PropTypes.array,
    titleFormat: PropTypes.string.def("YYYY-MM-DD"),
    partialUpdate: PropTypes.bool.def(false),
    rangeSeparator: PropTypes.string.def(" ~ "),
    showWeekNumber: PropTypes.bool.def(false),
    hourStep: PropTypes.number.def(1),
    minuteStep: PropTypes.number.def(1),
    secondStep: PropTypes.number.def(1),
    hourOptions: PropTypes.array,
    minuteOptions: PropTypes.array,
    secondOptions: PropTypes.array,
    showHour: PropTypes.bool,
    showMinute: PropTypes.bool,
    showSecond: PropTypes.bool,
    use12h: PropTypes.bool,
    showTimeHeader: PropTypes.bool.def(false),
    timeTitleFormat: PropTypes.string.def("YYYY-MM-DD"),
    timePickerOptions: PropTypes.object,
    prefixClass: PropTypes.string.def("mx"),
    scrollDuration: PropTypes.number.def(100),
    validator: PropTypes.bool.def(true)
  },
  data() {
    const state = {
      value: this.value
    };

    return {
      state
    };
  },
  watch: {
    value(value) {
      this.state.value = value;
    }
  },
  methods: {
    handleInput(value) {
      this.state.value = value;
      this.$emit("input", value);

      if (this.validator) {
        this.dispatch("vui-form-item", "change", value);
      }
    },
    handleChange(value, type) {
      this.$emit("change", value, type);
    }
  },
  render() {
    const { $slots: slots, $props: props, $listeners: listeners } = this;

    const attributes = {
      props: {
        ...props,
        value: this.state.value
      },
      on: {
        ...listeners,
        input: this.handleInput,
        change: this.handleChange
      }
    };

    return (
      <DatePicker {...attributes} />
    );
  }
};

export default VuiDatepicker;