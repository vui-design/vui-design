/**
* 创建一个 start ~ end 范围内的数值数组（包含 start，但不包含 end）
* 如果 start 是负数，且未指定 end 和 step，那么 end 将取值于 start，start 会被改写为 0，step 为 -1
* 如果 end 小于 start，且为指定 step，那么 step 将会被默认设置为 -1
* @param {Number} start 起始值
* @param {Number} end 结束值
* @param {Number} step 范围的增量或者减量
*/
export default function range(start, end, step) {
	if (end == null) {
		end = start || 0;
		start = 0;
	}

	if (!step) {
		step = end < start ? -1 : 1;
	}

	const length = Math.max(Math.ceil((end - start) / step), 0);
	let range = Array(length);

	for (let i = 0; i < length; i++, start += step) {
		range[i] = start;
	}

	return range;
};