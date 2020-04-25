import Locale from "vui-design/mixins/locale";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import { getCalendar, clearTime, isInRange } from "vui-design/utils/moment";

export default {
	name: "vui-datepicker-date-table",

	mixins: [
		Locale
	],

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		mode: {
			type: String,
			default: undefined
		},
		date: {
			type: Date,
			default: undefined
		},
		value: {
			type: Array,
			default: undefined
		},
		rangeState: {
			type: Object,
			default: () => {
				return {
					start: null,
					end: null,
					selecting: false
				};
			}
		},
		showWeekNumber: {
			type: Boolean,
			default: false
		},
		getDateDisabled: {
			type: Function,
			default: undefined
		}
	},

	data() {
		return {

		};
	},

	methods: {
		getWeekDays() {
			const { showWeekNumber, t: translate } = this;

			const weekStartDay = Number(translate("vui.datepicker.weekStartDay"));
			const array = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map(weekDay => translate("vui.datepicker.weekDays." + weekDay));
			const weekDays = array.splice(weekStartDay, 7 - weekStartDay).concat(array.splice(0, weekStartDay));

			return showWeekNumber ? [""].concat(weekDays) : weekDays;
		},
		getCalendar() {
			const { mode, date, value, rangeState, showWeekNumber, getDateDisabled, t: translate } = this;

			const rangeStart = rangeState.start && clearTime(rangeState.start);
			const rangeEnd = rangeState.end && clearTime(rangeState.end);
			const rangeSelecting = mode === "range" && rangeState.selecting;

			const days = rangeSelecting ? [rangeState.start] : value;
			const selectedDays = days.filter(Boolean).map(clearTime);
			const [minDay, maxDay] = days.map(clearTime);
			const isRange = mode === "range";

			const year = date.getFullYear();
			const month = date.getMonth();
			const weekStartDay = Number(translate("vui.datepicker.weekStartDay"));
			const iterator = col => {
				if (col.type === "week-number") {
					return {
						...col
					};
				}
				else {
					col.date.setTime(col.date.getTime() + col.date.getTimezoneOffset() * 60000 + 480 * 60 * 1000);

					const isInMonth = col.date.getMonth() === month;
					const current = clearTime(col.date);

					return {
						...col,
						start: isRange && isInMonth && current === minDay,
						end: isRange && isInMonth && current === maxDay,
						range: isRange && isInMonth && isInRange(current, rangeStart, rangeEnd),
						selected: isInMonth && selectedDays.includes(current),
						disabled: is.function(getDateDisabled) && getDateDisabled(new Date(current))
					};
				}
			};

			return getCalendar({ year, month, weekStartDay, showWeekNumber, iterator });
		},

		handleMouseenter(col) {
			if (!this.rangeState.selecting || col.type === "week-number" || col.disabled) {
				return;
			}

			this.$emit("changeRange", new Date(clearTime(col.date)));
		},
		handleClick(col) {
			if (col.type === "week-number" || col.disabled) {
				return;
			}

			this.$emit("select", new Date(clearTime(col.date)));
		}
	},

	render() {
		const { classNamePrefix: customizedClassNamePrefix, getWeekDays, getCalendar, handleMouseenter, handleClick } = this;
		const classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "datepicker-date-table");
		const weekDays = getWeekDays();
		const calendar = getCalendar();

		return (
			<div class={`${classNamePrefix}`}>
				<div class={`${classNamePrefix}-colgroup`}>
					{
						weekDays.map(weekDay => {
							const classes = {
								[`${classNamePrefix}-col`]: true,
								[`${classNamePrefix}-col-week-day`]: true
							};

							return (
								<div class={classes}>
									<em>{weekDay}</em>
								</div>
							);
						})
					}
				</div>
				{
					calendar.data.map(colgroup => {
						return (
							<div class={`${classNamePrefix}-colgroup`}>
								{
									colgroup.map(col => {
										const classes = {
											[`${classNamePrefix}-col`]: true,
											[`${classNamePrefix}-col-${col.type}`]: col.type,
											[`${classNamePrefix}-col-in-range`]: col.range && !col.start && !col.end,
											[`${classNamePrefix}-col-selected`]: col.start || col.end || col.selected,
											[`${classNamePrefix}-col-disabled`]: col.disabled
										};
										const onMouseenter = col => handleMouseenter(col);
										const onClick = col => handleClick(col);

										return (
											<div class={classes}>
												<em onMouseenter={onMouseenter} onClick={onClick}>{col.type === "week-number" ? col.week : col.day}</em>
											</div>
										);
									})
								}
							</div>
						);
					})
				}
			</div>
		);
	}
};