import Emitter from "vui-design/mixins/emitter";
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
		type: {
			type: String,
			default: "date",
			validator: value => ["date", "datetime", "year", "month", "time", "week"].indexOf(value) > -1
		},
		range: {
			type: Boolean,
			default: false
		},
		format: {
			type: String,
			default: "YYYY-MM-DD"
		},
		valueType: {
			type: String,
			default: "format"
		},
		defaultValue: {
			type: Date,
			default: () => new Date()
		},
		value: {

		},
		lang: {
			type: Object,
			default: undefined
		},
		placeholder: {
			type: String,
			default: ""
		},
		editable: {
			type: Boolean,
			default: true
		},
		clearable: {
			type: Boolean,
			default: true
		},
		confirm: {
			type: Boolean,
			default: false
		},
		confirmText: {
			type: String,
			default: "OK"
		},
		multiple: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		disabledDate: {
			type: Function,
			default: undefined
		},
		disabledTime: {
			type: Function,
			default: undefined
		},
		appendToBody: {
			type: Boolean,
			default: true
		},
		inline: {
			type: Boolean,
			default: false
		},
		inputClass: {
			type: String,
			default: "mx-datepicker-input"
		},
		inputAttr: {
			type: Object,
			default: undefined
		},
		open: {
			type: Boolean,
			default: undefined
		},
		defaultPanel: {
			type: String,
			default: undefined
		},
		popupStyle: {
			type: Object,
			default: undefined
		},
		popupClass: {
			default: undefined
		},
		shortcuts: {
			type: Array,
			default: undefined
		},
		titleFormat: {
			type: String,
			default: "YYYY-MM-DD"
		},
		partialUpdate: {
			type: Boolean,
			default: false
		},
		rangeSeparator: {
			type: String,
			default: " ~ "
		},
		showWeekNumber: {
			type: Boolean,
			default: false
		},
		hourStep: {
			type: Number,
			default: 1
		},
		minuteStep: {
			type: Number,
			default: 1
		},
		secondStep: {
			type: Number,
			default: 1
		},
		hourOptions: {
			type: Array,
			default: undefined
		},
		minuteOptions: {
			type: Array,
			default: undefined
		},
		secondOptions: {
			type: Array,
			default: undefined
		},
		showHour: {
			type: Boolean,
			default: undefined
		},
		showMinute: {
			type: Boolean,
			default: undefined
		},
		showSecond: {
			type: Boolean,
			default: undefined
		},
		use12h: {
			type: Boolean,
			default: undefined
		},
		showTimeHeader: {
			type: Boolean,
			default: false
		},
		timeTitleFormat: {
			type: String,
			default: "YYYY-MM-DD"
		},
		timePickerOptions: {
			type: Object,
			default: null
		},
		prefixClass: {
			type: String,
			default: "mx"
		},
		scrollDuration: {
			type: Number,
			default: 100
		},
		validator: {
			type: Boolean,
			default: true
		}
	},

	data() {
		return {
			stateValue: this.value
		};
	},

	watch: {
		value(value) {
			this.stateValue = value;
		}
	},

	methods: {
		handleChange(value) {
			this.stateValue = value;
			this.$emit("input", value);
			this.$emit("change", value);

			if (this.validator) {
				this.dispatch("vui-form-item", "change", value);
			}
		}
	},

	render() {
		const { $slots: slots, $props: props, $listeners: listeners } = this;

		const attributes = {
			props: {
				...props,
				value: this.stateValue
			},
			on: {
				...listeners,
				input: this.handleChange,
				change: this.handleChange
			}
		};

		return (
			<DatePicker {...attributes} />
		);
	}
};

export default VuiDatepicker;