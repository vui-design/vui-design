import VuiButtonGroup from "vui-design/components/button-group";
import VuiButton from "vui-design/components/button";
import VuiDatepickerYearTable from "../tables/year";
import VuiDatepickerMonthTable from "../tables/month";
import VuiDatepickerDateTable from "../tables/date";
import VuiDatepickerTimeTable from "../tables/time";

export default {
	name: "vui-datepicker-single-picker",

	components: {
		VuiButtonGroup,
		VuiButton,
		VuiDatepickerYearTable,
		VuiDatepickerMonthTable,
		VuiDatepickerDateTable,
		VuiDatepickerTimeTable
	},

	props: {
		// 日期选择类型
		type: {
			type: String,
            default: undefined
		},
		// 当前选择模式，是选择年呢？月呢？日期呢？还是时间呢？
		mode: {
			type: String,
            default: "date",
            validator: value => ["year", "month", "date", "time"].indexOf(value) > -1
		},
		// 默认面板日期
		defaultPickerDate: {
			type: Date,
			default: undefined
		},
		// 值
		value: {
			type: Date,
			default: undefined
		},
		// 格式
		format: {
			type: String,
			default: "yyyy-MM-dd"
		},
		// 是否显示周数
		showWeekNumber: {
			type: Boolean,
			default: false
		},
		// 是否含有时间选择器
		showTimepicker: {
			type: Boolean,
			default: false
		},
		// 时间选择器的刻度间隔，数组的三项分别对应时、分、秒
		// 例如设置为 [1, 15] 时，时钟会显示：00、01、02，分钟会显示：00、15、30
		steps: {
			type: Array,
			default: () => []
		},
		// 是否显示确认按钮
		confirmable: {
			type: Boolean,
			default: false
		}
	},

	data() {
		return {
			defaultValue: this.defaultPickerDate || this.value || new Date()
		};
	},

	methods: {
		handleChangeYear(direction) {

		},
		handleChangeMonth(direction) {

		},
		handleToggleMode() {

		},
		handleClear() {

		},
		handleConfirm() {

		}
	},

	render() {
		const start = new Date();
		const end = new Date();

		start.setDate(12);
		end.setDate(28);

		const dates = [start, end]




		return (
			<div class="vui-datepicker-picker vui-datepicker-single-picker" onMousedown={e => e.preventDefault()}>
				<div class="vui-datepicker-picker-header">

					<div class="vui-datepicker-picker-prev-year" onClick={e => this.handleChangeYear(-1)}>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 10">
							<path d="M1.4,5l4.1-4.1c0.2-0.2,0.2-0.6,0-0.8c-0.2-0.2-0.6-0.2-0.8,0L0.2,4.6c-0.2,0.2-0.2,0.6,0,0.8l4.5,4.4c0.2,0.2,0.6,0.2,0.8,0c0.2-0.2,0.2-0.6,0-0.8L1.4,5z M5.8,5l4.1-4.1c0.2-0.2,0.2-0.6,0-0.8C9.6-0.1,9.3-0.1,9,0.2L4.6,4.6c-0.2,0.2-0.2,0.6,0,0.8L9,9.8c0.2,0.2,0.6,0.2,0.8,0s0.2-0.6,0-0.8L5.8,5z" />
						</svg>
					</div>
					<div class="vui-datepicker-picker-prev-month" onClick={e => this.handleChangeMonth(-1)}>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"  viewBox="0 0 10 10">
							<path d="M3.6,5l4.1-4.1c0.2-0.2,0.2-0.6,0-0.8c-0.2-0.2-0.6-0.2-0.8,0L2.4,4.6c-0.2,0.2-0.2,0.6,0,0.8l4.5,4.4 c0.2,0.2,0.6,0.2,0.8,0c0.2-0.2,0.2-0.6,0-0.8L3.6,5z" />
						</svg>
					</div>
					<div class="vui-datepicker-picker-year">2019年</div>
					<div class="vui-datepicker-picker-month">12月</div>
					<div class="vui-datepicker-picker-next-month" onClick={e => this.handleChangeMonth(1)}>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 10">
							<path d="M6.4,5L2.4,0.9c-0.2-0.2-0.2-0.6,0-0.8c0.2-0.2,0.6-0.2,0.8,0l4.5,4.4c0.2,0.2,0.2,0.6,0,0.8L3.2,9.8c-0.2,0.2-0.6,0.2-0.8,0c-0.2-0.2-0.2-0.6,0-0.8L6.4,5z" />
						</svg>
					</div>
					<div class="vui-datepicker-picker-next-year" onClick={e => this.handleChangeYear(1)}>
						<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 10">
							<path d="M8.6,5L4.6,0.9c-0.2-0.2-0.2-0.6,0-0.8c0.2-0.2,0.6-0.2,0.8,0l4.5,4.4c0.2,0.2,0.2,0.6,0,0.8L5.4,9.8c-0.2,0.2-0.6,0.2-0.8,0c-0.2-0.2-0.2-0.6,0-0.8L8.6,5z M4.2,5L0.2,0.9c-0.2-0.2-0.2-0.6,0-0.8c0.2-0.2,0.6-0.2,0.8,0l4.5,4.4c0.2,0.2,0.2,0.6,0,0.8L1,9.8c-0.2,0.2-0.6,0.2-0.8,0c-0.2-0.2-0.2-0.6,0-0.8L4.2,5z" />
						</svg>
					</div>

				</div>
				<div class="vui-datepicker-picker-body">

					<VuiDatepickerDateTable
						mode={this.mode}
						date={this.defaultValue}
						value={dates}
						showWeekNumber={this.showWeekNumber}
						getDateDisabled={this.getDateDisabled}
					/>

				</div>
				<div class="vui-datepicker-picker-footer">

					<a class="vui-datepicker-btn-mode" onClick={this.handleToggleMode}>选择时间</a>
					<VuiButtonGroup size="small">
						<VuiButton onClick={this.handleClear}>清空</VuiButton>
						<VuiButton onClick={this.handleConfirm}>确认</VuiButton>
					</VuiButtonGroup>

				</div>
			</div>
		);
	}
};