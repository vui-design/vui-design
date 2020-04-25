/**
* 创建一个包含从 start 到 end，但不包含 end 本身的整数数组，便于 each 和 map 循环
* 如果 start 是负数，而 end 或 step 没有指定，那么 step 从 -1 为开始。 如果 end 没有指定，start 设置为 0。 如果 end 小于 start ，会创建一个空数组，除非指定了 step
* @param {Number} start 开始的范围
* @param {Number} end 结束的范围
* @param {Number} step 范围的增量或者减量
*/
export default function range(start, end, step) {
	if (end == null) {
		end = start || 0;
		start = 0;
	}

	if(!step){
		step = end < start ? -1 : 1;
	}

	let length = Math.max(Math.ceil((end - start) / step), 0);
	let range = Array(length);

	for (let i = 0; i < length; i++, start += step) {
		range[i] = start;
	}

	return range;
};