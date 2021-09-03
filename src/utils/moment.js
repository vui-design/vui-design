import fecha from "../libs/fecha";
import is from "./is";


// 一天
export const oneDay = 24 * 60 * 60 * 1000;

// 将给定的值转换为日期对象
export const parseToDate = value => {
	let date = new Date(value);

	if (is.string(value) && isNaN(date.getTime())){
		date = value.split("-").map(Number);
		date[1] += 1;
		date = new Date(...date);
	}

	if (isNaN(date.getTime())) {
		date = null;
	}

	return date;
};

// 清除某个日期的时、分、秒以及毫秒数据，并返回时间戳
export const clearTime = value => new Date(value).setHours(0, 0, 0, 0);

// 获取某个月一共有多少天
// 这里的 month 参数同 new Date(year, month, day) 中 month 参数一致，取值范围 0~11，0 表示一月，11 表示十二月
export const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

// 创建一个自定义时间的当前日期对象
export const createDateWithCustomTime = (hour = 0, minute = 0, second = 0, milliseconds = 0) => {
	const date = new Date();

	date.setHours(hour);
	date.setMinutes(minute);
	date.setSeconds(second);
	date.setMilliseconds(milliseconds);

	return date;
};

// 获取下一个日期
export const getNextDate = (date, days = 1) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);

// 获取日期时间戳
export const getDateTimestamp = value => {
	if (is.string(value) || is.number(value)) {
		return clearTime(new Date(time));
	}
	else if (is.date(value)) {
		return clearTime(value);
	}
	else {
		return NaN;
	}
};

// 获取某个日期在其所属年份中是第几周
export const getWeekNumber = (y, m, d, iso) => {
	if (m > 11){
		y++;
		m = 0;
	}

	let date = new Date(y, m, d);

	if (iso) {
		date.setDate(date.getDate() + 4 - (date.getDay() || 7));
	}

	let year = iso ? date.getFullYear() : y;
	let firstDayInJanuary = new Date(year, 0, 1);
	let days = 1 + Math.round((date - firstDayInJanuary) / oneDay);

	if (!iso) {
		days += firstDayInJanuary.getDay();
	}

	let weekNumber = Math.ceil(days / 7);

	if (!iso) {
		let firstDayInNextYear = new Date(y + 1, 0, 1);
		let weekDayInNextYear = firstDayInNextYear.getDay();

		if (new Date(y, m, d).getTime() >= firstDayInNextYear.getTime() - (oneDay * weekDayInNextYear)) {
			weekNumber = 1;
		}
	}

	return weekNumber;
};

// 判断某个日期是否处于开始日期和结束日期之间
export const isInRange = (date, startDate, endDate) => {
	if (!startDate || !endDate) {
		return false;
	}

	const [start, end] = [startDate, endDate].sort();

	return date >= start && date <= end;
};

// 生成日历
// options.year 年份
// options.month 月份
// options.weekStartDay 一周是以周日开始，还是以周一开始（0 表示周日，1 表示周一）
// options.showWeekNumber 是否显示周数
// options.iterator 日历单元格格式化函数
export const getCalendar = options => {
	let year = options.year;
	let month = options.month;
	let weekStartDay = typeof options.weekStartDay === "undefined" ? 0 : options.weekStartDay;
	let showWeekNumber = options.showWeekNumber;
	let iterator = options.iterator;

	// 日历当中，一周是以周日开始，还是以周一开始（0 表示周日，1 表示周一）
	let iso = weekStartDay === 1;
	// 当前月的第一天
	let firstDay = new Date(year, month, 1, 0, 0, 0, 0);
	// 当前月的第一天对应周几，返回值是 0 到 6 之间的一个整数（0 表示周日，6 表示周六）
	let weekDay = firstDay.getDay();
	// 根据 iso 的值计算当前月的第一天在日历中的位置
	let offset = weekStartDay - (weekDay || (iso ? 7 : 0));
	// 当前月的第一天在其所属年份中是第几周
	let weekNumber = getWeekNumber(year, month, 1, iso);
	// 当前月最大天数（即当前月一共多少天）
	let maxDays = getDaysInMonth(year, month);
	// 前一个月最大天数（即前一个月一共多少天）
	let prevMonthMaxDays = getDaysInMonth(year, month - 1);

	// 日历
	let data = [];

	for (let m = 0; m < 6; m++) {
		let cols = [];

		if (showWeekNumber) {
			let col = {
				type: "week-number",
				standard: iso ? "ISO 8601" : "US",
				week: weekNumber
			};

			cols.push(col);
		}

		let dateType;
		let dateYear;
		let dateMonth;
		let dateDay;

		for (let n = 0; n < 7; n++){
			offset++;

			if (offset < 1) {
				dateType = "day-in-prev-month";
				dateYear = (month - 1) < 0 ? (year - 1) : year;
				dateMonth = (month - 1) < 0 ? 11 : (month - 1);
				dateDay = prevMonthMaxDays + offset;
			}
			else if (offset > maxDays) {
				dateType = "day-in-next-month";
				dateYear = (month + 1) > 11 ? (year + 1) : year;
				dateMonth = (month + 1) > 11 ? 0 : (month + 1);
				dateDay = offset - maxDays;
			}
			else {
				dateType = clearTime(new Date(year, month, offset)) === clearTime(new Date()) ? "today" : "day";
				dateYear = year;
				dateMonth = month;
				dateDay = offset;
			}

			let col = {
				type: dateType,
				standard: iso ? "ISO 8601" : "US",
				week: weekNumber,
				year: dateYear,
				month: dateMonth,
				day: dateDay,
				date: new Date(dateYear, dateMonth, dateDay)
			};

			if (is.function(iterator)) {
				col = iterator.call(null, col);
			}

			cols.push(col);
		}

		weekNumber = getWeekNumber(dateYear, dateMonth, dateDay + 1, iso);
		data.push(cols);
	}

	// 返回生成的日历
	return {
		year: year,
		month: month,
		daysInMonth: maxDays,
		data: data
	};
};


// 默认日期格式
export const defaultFormats = {
	year: "yyyy",
	yearrange: "yyyy",
	month: "yyyy-MM",
	monthrange: "yyyy-MM",
	date: "yyyy-MM-dd",
	daterange: "yyyy-MM-dd",
	time: "HH:mm:ss",
	timerange: "HH:mm:ss",
	datetime: "yyyy-MM-dd HH:mm:ss",
	datetimerange: "yyyy-MM-dd HH:mm:ss"
};

// 日期格式化程序
export const formatter = (value, format = "yyyy-MM-dd") => {
	value = parseToDate(value);

	if (!value) {
		return "";
	}

	return fecha.format(value, format);
};

// 日期解析器
export const parser = (value, format = "yyyy-MM-dd") => fecha.parse(value, format);

// 默认格式化程序
export const defaultFormatter = value => {
	if (!value) {
		return "";
	}

	return String(value);
};

// 默认解析器
export const defaultParser = value => {
	if (value === undefined || value === "") {
		return null;
	}

	return value;
};

// 日期格式化程序
export const dateFormatter = (value, format) => formatter(value, format);

// 日期解析器
export const dateParser = (value, format) => parser(value, format);

// 日期范围格式化程序
export const dateRangeFormatter = (value, format, separator) => {
	if (is.array(value) && value.length === 2) {
		const [start, end] = value;

		if (start && end) {
			return formatter(start, format) + separator + formatter(end, format);
		}
	}
	else if (!is.array(value) && is.date(value)){
		return formatter(value, format);
	}

	return "";
};

// 日期范围解析器
export const dateRangeParser = function(value, format, separator) {
	const array = is.array(value) ? value : value.split(separator);

	if (array.length === 2) {
		const [start, end] = array;

		return [
			is.date(start) ? start : parser(start, format),
			is.date(end) ? end : parser(end, format)
		];
	}

	return [];
};

// Map Type Value Resolver
export const mapTypeValueResolver = {
	default: {
		formatter: defaultFormatter,
		parser: defaultParser
	},
	year: {
		formatter: dateFormatter,
		parser: dateParser
	},
	yearrange: {
		formatter: dateRangeFormatter,
		parser: dateRangeParser
	},
	month: {
		formatter: dateFormatter,
		parser: dateParser
	},
	monthrange: {
		formatter: dateRangeFormatter,
		parser: dateRangeParser
	},
	date: {
		formatter: dateFormatter,
		parser: dateParser
	},
	daterange: {
		formatter: dateRangeFormatter,
		parser: dateRangeParser
	},
	time: {
		formatter: dateFormatter,
		parser: dateParser
	},
	timerange: {
		formatter: dateRangeFormatter,
		parser: dateRangeParser
	},
	datetime: {
		formatter: dateFormatter,
		parser: dateParser
	},
	datetimerange: {
		formatter: dateRangeFormatter,
		parser: dateRangeParser
	}
};

