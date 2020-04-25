import VuiDatepickerSinglePicker from "./components/pickers/single";
import VuiDatepickerRangePicker from "./components/pickers/range";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import { defaultFormats, mapTypeValueResolver } from "vui-design/utils/moment";

const VuiDatepicker = {
	name: "vui-datepicker",

	components: {
		VuiDatepickerSinglePicker,
		VuiDatepickerRangePicker
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		type: {
			type: String,
			default: "date",
			validator: value => ["date", "daterange", "datetime", "datetimerange", "year", "month"].indexOf(value) > -1
		},
		placeholder: {
			type: String,
			default: undefined
		},
		value: {
			type: [String, Date, Array],
			default: undefined
		},
		format: {
			type: String,
			default: undefined
		},
		separator: {
			type: String,
			default: ","
		},
		showWeekNumber: {
			type: Boolean,
			default: false
		},
		shortcuts: {
			type: Array,
			default: undefined
		},
		steps: {
			type: Array,
			default: () => []
		},
		getDateDisabled: {
			type: Function,
			default: () => false
		},
		getTimeDisabled: {
			type: Function,
			default: () => false
		},
		size: {
			type: String,
			default: undefined,
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		readonly: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		defaultPickerDate: {
			type: Date,
			default: undefined
		},
		placement: {
			type: String,
			default: "bottom-start",
			validator: value => ["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end", "left", "left-start", "left-end", "right", "right-start", "right-end"].indexOf(value) > -1
		},
		animation: {
			type: String,
			default: "vui-datepicker-panel-scale"
		},
		getPopupContainer: {
			type: Function,
			default: () => document.body
		}
	},

	data() {
		return {
			defaultVisible: false,
			mode: this.getSelectionMode(this.type),
			defaultValue: this.mapValueToDate(this.value),
		};
	},

	methods: {
		getSelectionMode(type) {
			if (type.match(/^date/)) {
				type = "date";
			}

			return (["year", "month", "date", "time"].indexOf(type) > -1) && type;
		},

		mapValueToDate(value) {
			const type = this.type;
			const format = this.format || defaultFormats[type];
			const parser = (mapTypeValueResolver[type] || mapTypeValueResolver["default"]).parser;

			if (type.includes("range")) {
				if (!value) {
					value = [null, null];
				}
				else if (is.string(value)) {
					value = parser(value, format, this.separator);
				}
				else {
					const [start, end] = value;

					if (is.date(start) && is.date(end)){
						value = value.map(date => new Date(date.getTime()));
					}
					else if (is.string(start) && is.string(end)){
						value = parser(value, format);
					}
					else if (!start || !end){
						value = [null, null];
					}
				}
			}
			else {
				if (!value) {
					value = null;
				}
				else if (is.string(value)) {
					value = parser(value, format);
				}
				else if (is.date(value)) {
					value = new Date(value.getTime());
				}
			}

			return value;
		},
		mapDateToValue() {

		},

		handleSelect() {

		},
		handleChangeMode(type) {
			this.mode = this.getSelectionMode(type);
		},
		handleClear() {

		},
		handleConfirm() {

		}
	},

	render() {
		const { classNamePrefix: customizedClassNamePrefix, type, mode, defaultValue, defaultPickerDate, format, showWeekNumber, steps, confirmable, placement, animation, getPopupContainer } = this;
		const { handleSelect, handleChangeMode, handleClear, handleConfirm } = this;


		const portal = getPopupContainer();
		const isRange = type === "daterange" || type === "datetimerange";
		const isConfirmable = confirmable || type === "datetime" || type === "datetimerange";









		const classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "datepicker");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
		};








		let panel;

		if (isRange) {
			panel = (
				<VuiDatepickerRangePicker
					ref="panel"
					type={type}
					mode={mode}
					value={defaultValue}
					defaultPickerDate={defaultPickerDate}
					format={format}
					showWeekNumber={showWeekNumber}
					showTimepicker={type === "dateTime" || type === "dateTimeRange"}
					steps={steps}
					confirmable={isConfirmable}
					onSelect={handleSelect}
					onChangeMode={handleChangeMode}
					onClear={handleClear}
					onConfirm={handleConfirm}
				/>
			);
		}
		else {
			panel = (
				<VuiDatepickerSinglePicker
					ref="panel"
					type={type}
					mode={mode}
					value={defaultValue}
					defaultPickerDate={defaultPickerDate}
					format={format}
					showWeekNumber={showWeekNumber}
					showTimepicker={type === "dateTime" || type === "dateTimeRange"}
					steps={steps}
					confirmable={isConfirmable}
					onSelect={handleSelect}
					onChangeMode={handleChangeMode}
					onClear={handleClear}
					onConfirm={handleConfirm}
				/>
			);
		}




		return (
			<div class={classes.el}>
				<div class={`${classNamePrefix}-input`}>
					<input type="text" />
				</div>
				<transition appear>
					{panel}
				</transition>
			</div>
		);
	}
};

export default VuiDatepicker;