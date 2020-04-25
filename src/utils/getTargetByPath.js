export default function getTargetByPath(source, path = "", strict) {
	let target = source;

	path = path.replace(/\[(\w+)\]/g, ".$1");
	path = path.replace(/^\./, "");

	let keys = path.split(".");
	let i = 0;
	let length = keys.length;

	for (; i < length - 1; ++i) {
		if (!target && !strict) {
			break;
		}

		let key = keys[i];

		if (key in target) {
			target = target[key];
		}
		else {
			if (strict) {
				throw new Error("[Vui warn][utils]: please transfer a valid prop path.");
			}

			break;
		}
	}

	return {
		from: target,
		key: keys[i],
		value: target ? target[keys[i]] : null
	};
};