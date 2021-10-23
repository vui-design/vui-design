var unitDay = 1000 * 60 * 60 * 24;

function daysInMonth(year, month) {
	return new Date(year, month + 1, 0).getDate();
}

function getYear(year, month, weekNr){
	if (month === 0 && weekNr > 50) {
		return year - 1;
	}
	else if (month === 11 && weekNr < 10) {
		return year + 1;
	}
	else {
		return year;
	}
}

function getDateInfo(y, m, d, iso) {
	if (m > 11){
		y++;
		m = 0;
	}

	var date = new Date(y, m, d);

	if (iso) {
		date.setDate(date.getDate() + 4 - (date.getDay() || 7));
	}

	var year = iso ? date.getFullYear() : y;
	var firstOfJanuary = new Date(year, 0, 1);
	var numberOfDays = 1 + Math.round((date - firstOfJanuary) / unitDay);

	if (!iso) {
		numberOfDays += firstOfJanuary.getDay();
	}

	var w = Math.ceil(numberOfDays / 7);

	if (!iso) {
		var initialDay = new Date(y, m, d);
		var beginOfNextYear = new Date(y + 1, 0, 1);
		var startDayOfNextYear = beginOfNextYear.getDay();

		if (initialDay.getTime() >= beginOfNextYear.getTime() - (unitDay * startDayOfNextYear)) {
			w = 1;
		}
	}

	return w;
}

function getCalender(year, month, iterator) {
	var weekStart = typeof this.weekStart === "undefined" ? 1 : this.weekStart;
	var lang = this.lang || "en";
	var onlyDays = this.onlyDays;
	var iso = weekStart === 1;

	var cells = [];
	var monthStartDate = new Date(year, month, 1);
	var dayOfWeek = monthStartDate.getDay() || (iso ? 7 : 0);
	var currentDay = weekStart - dayOfWeek;

	var weekNr = getDateInfo(year, month, 1, iso);
	var maxDays = daysInMonth(year, month);
	var lastMonthMaxDays = daysInMonth(year, month - 1);
	var currentMonth, day, dayBefore;
	var currentYear = getYear(year, month, weekNr);

	var result = {
		year: year,
		month: month,
		daysInMonth: maxDays
	};

	for (var i = 0; i < 7; i++) {
		dayBefore = currentDay;

		for (var j = 0; j < 8; j++){
			if (i > 0 && j > 0) {
				currentDay++;
			}

			if (currentDay > maxDays || currentDay < 1) {
				day = currentDay > maxDays ? currentDay - maxDays : lastMonthMaxDays + currentDay;
				currentMonth = currentDay > maxDays ? month + 1 : month - 1;
			}
			else {
				day = currentDay;
				currentMonth = month;
			}

			var type = (function(){
				if (j === 0) return "weekLabel";
				else if (i === 0) return "dayLabel";
				else if (currentDay < 1) return "prevMonth";
				else if (currentDay > maxDays) return "nextMonth";
				else return "monthDay";
			})();
			var isDay = dayBefore !== currentDay && i > 0;

			var dayData = {
				desc: isDay ? day : weekNr,
				week: weekNr,
				type: type,
				format: iso ? "ISO 8601" : "US",
				date: isDay ? new Date(Date.UTC(year, currentMonth, day)) : false,
				year: currentYear,
				index: cells.length
			};

			if (iterator) {
				if (typeof iterator === "function") {
					dayData = iterator.call(result, dayData, lang);
				}
				else {
					iterator.forEach(function(fn) {
						dayData = fn.call(result, dayData, lang);
					});
				}
			}

			if (onlyDays && isDay) {
				cells.push(dayData);
			}
			else if (!onlyDays) {
				cells.push(dayData);
			}
		}

		if (i > 0) {
			weekNr = getDateInfo(year, currentMonth, day + 1, iso);
		}

		currentYear = getYear(year, month, weekNr);
	}

	result.cells = cells;

	return result;
}

export default function(options){
	return getCalender.bind(options);
};