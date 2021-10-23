import is from "../../../utils/is";
import clone from "../../../utils/clone";

export function getValuePrecision(step) {
	const string = String(step);
	let precision = 0;

	if (string.indexOf(".") > -1) {
		precision = string.length - string.indexOf(".") - 1;
	}

	return precision;
};

export function getClosestStep(value, props) {
	let steps = [];

	if (props.marks) {
		steps = Object.keys(props.marks).map(parseFloat);
	}

	if (props.step !== null) {
		const precision = getValuePrecision(props.step);
		const times = Math.pow(10, precision);

		const maxSteps = Math.floor((props.max * times - props.min * times) / (props.step * times));
		const nowSteps = Math.min((value - props.min) / props.step, maxSteps);

		steps.push(Math.round(nowSteps) * props.step + props.min);
	}

	const array = steps.map(breakpoint => Math.abs(value - breakpoint));

	return steps[array.indexOf(Math.min(...array))];
};

export function getClosestValue(value, props) {
	const closestStep = isFinite(getClosestStep(value, props)) ? getClosestStep(value, props) : 0;

	if (props.step === null) {
		return closestStep;
	}
	else {
		return parseFloat(closestStep.toFixed(getValuePrecision(props.step)));
	}
};




// 获取 Slider 容器宽度或高度
export const getSliderSize = (container, vertical) => {
	if (!is.element(container)) {
		return;
	}

	return container[vertical ? "clientHeight" : "clientWidth"];
};

// 根据 SliderDragger 的当前位置计算状态值
export const getSliderDraggerValue = (position, props) => {
	// if (position < 0) {
	// 	position = 0;
	// }
	// else if (position > 100) {
	// 	position = 100;
	// }

	// const stepSize = 100 / ((props.max - props.min) / props.step);
	// const steps = Math.round(position / stepSize);
	// const precision = getPrecision(props.min, props.max, props.step);
	// const value = (steps * stepSize * (props.max - props.min)) / 100 + props.min;

	// return parseFloat(value.toFixed(precision));

	if (position < 0) {
		position = 0;
	}
	else if (position > 100) {
		position = 100;
	}

	const stepSize = 100 / ((props.max - props.min) / props.step);
	const steps = Math.round(position / stepSize);
	const value = (steps * stepSize * (props.max - props.min)) / 100 + props.min;

	return getClosestValue(value, props);
};

// 获取数值精度
const mapper = value => {
	const decimal = String(value).split(".")[1];

	return decimal ? decimal.length : 0;
};

export const getPrecision = (min, max, step) => {
	const precisions = [min, max, step].map(mapper);

	return Math.max.apply(null, precisions);
};

// 根据组件的 props 属性获取内部 value 状态值
export const getValueFromProps = (value, props) => {
	if (props.range) {
		if (is.array(value) && value.length === 2) {
			value = [
				Math.max(props.min, value[0]),
				Math.min(props.max, value[1])
			];
		}
		else {
			value = Array(...Array(2)).map(() => props.min);
		}
	}
	else {
		if (is.number(value)) {
			value = Math.max(props.min, value);
			value = Math.min(props.max, value);
		}
		else {
			value = props.min;
		}
	}

	return value;
};

// 获取 step 集合
export const getSteps = (min, max, step, showSteps, marks) => {
	if (!marks) {
		marks = {};
	}

	const steps = Object.keys(marks).map(parseFloat);

	if (step && showSteps) {
		for (let i = min; i <= max; i += step) {
			if (steps.indexOf(i) === -1) {
				steps.push(i);
			}
		}
	}

	return steps.filter(step => step >= min && step <= max).sort((a, b) => a - b);
};

// 获取 mark 集合
export const getMarks = (min, max, marks) => {
	if (!marks) {
		marks = {};
	}

	const keys = Object.keys(marks).map(parseFloat);

	return keys.filter(key => key >= min && key <= max).sort((a, b) => a - b).map(key => {
		let attributes = {};

		if (is.json(marks[key])) {
			attributes = clone(marks[key]);
		}
		else {
			attributes.label = marks[key];
		}

		return {
			value: key,
			attributes
		};
	});
};

// 默认导出所有接口
export default {
	getClosestValue,
	getSliderSize,
	getSliderDraggerValue,
	getPrecision,
	getValueFromProps,
	getSteps,
	getMarks
};