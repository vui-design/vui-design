import padStart from "vui-design/utils/padStart";

const units = [
	["Y", 1000 * 60 * 60 * 24 * 365],
	["M", 1000 * 60 * 60 * 24 * 30],
	["D", 1000 * 60 * 60 * 24],
	["H", 1000 * 60 * 60],
	["m", 1000 * 60],
	["s", 1000],
	["S", 1]
];

export function parseToDate(value) {
	if (typeof value === "string") {
		value = value.replace(/-/g,  "/");
	}

	let date = new Date(value);

	if (isNaN(date.getTime())) {
		return null;
	}

	return date;
};

export function formatTimeString(duration, format) {
	let leftDuration = duration;

	return units.reduce((current, [name, unit]) => {
		if (current.indexOf(name) !== -1) {
			let value = Math.floor(leftDuration / unit);

			leftDuration -= value * unit;

			return current.replace(new RegExp(name + "+", "g"), match => {
				let length = match.length;

				return padStart(value.toString(), length, "0");
			});
		}

		return current;
	}, format);
};

export function formatter(h, current, target, format) {
	let difference = Math.max(target - current, 0);

	return formatTimeString(difference, format);
};

export default {
	parseToDate,
	formatTimeString,
	formatter
};