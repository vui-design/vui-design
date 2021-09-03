import Emitter from "../../../mixins/emitter";
import Locale from "../../../mixins/locale";
import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import range from "../../../utils/range";
import padStart from "../../../utils/padStart";
import addEventListener from "../../../utils/addEventListener";
import getElementByEvent from "../../../utils/getElementByEvent";
import getOffsetRect from "../../../utils/getOffsetRect";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiTimeroutine = {
	name: "vui-timeroutine",
	mixins: [
		Emitter,
		Locale
	],
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		classNamePrefix: PropTypes.string,
		value: PropTypes.string,
		timeSeparator: PropTypes.string.def("~"),
		timeSerieSeparator: PropTypes.string.def(",")
	},
	data() {
		const weeks = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
		const hours = range(0, 24);
		const times = range(0, 48);
		const value = weeks.map(() => []);

		const state = {
			weeks,
			hours,
			times,
			value,
			selection: {
				selecting: false,
				startX: 0,
				endX: 0,
				startY: 0,
				endY: 0,
				top: 0,
				left: 0,
				width: 0,
				height: 0,
				borderTopWidth: 0,
				borderLeftWidth: 0,
				style: {
					top: 0,
					left: 0,
					width: 0,
					height: 0
				}
			}
		};

		return {
			state
		};
	},
	watch: {
		value: {
			immediate: true,
			handler(value) {
				let newValue = this.state.weeks.map(() => []);

				if (!value) {
					this.state.value = newValue;
				}
				else {
					const times = this.state.times.length;
					const array = value.split("").map(Number).filter(item => is.number(item));

					array.forEach((item, index) => {
						const weekIndex = Math.floor(index / times);
						const timeIndex = index % times;

						if (item === 1) {
							newValue[weekIndex].push(timeIndex);
						}
					});

					this.state.value = newValue;
				}
			}
		}
	},
	methods: {
		isMaybeSelect(startTime, endTime, startWeek, endWeek) {
			const { state } = this;

			for (let weekIndex = startWeek; weekIndex <= endWeek; weekIndex++) {
				const weekValue = state.value[weekIndex];

				for (let timeIndex = startTime; timeIndex <= endTime; timeIndex++) {
					if (weekValue.indexOf(timeIndex) === -1) {
						return true;
					}
				}
			}

			return false;
		},
		chunk(array) {
			let result = [];

			array.forEach((value, index) => {
				let latest = result[result.length - 1];

				if (index === 0) {
					result.push([value]);
				}
				else if (value % 1 === 0 && value - latest[latest.length - 1] === 1) {
					latest.push(value);
				}
				else {
					result.push([value]);
				}
			});

			return result;
		},
		format(value) {
			if (is.integer(value)) {
				return padStart(value, 2, "0") + ":" + "00";
			}
			else {
				return padStart(Math.floor(value), 2, "0") + ":" + "30";
			}
		},
		handleSelectStart(e) {
			// 判断是否为鼠标左键被按下
			if (e.buttons !== 1 || e.which !== 1) {
				return;
			}

			const { $refs: references } = this;
			const element = getElementByEvent(e);

			// 判断事件源元素是否存在且为时间单元格
			if (!references.container || !element || !references.container.contains(element) || element.getAttribute("data-role") !== "time") {
				return;
			}

			const offsetRect = getOffsetRect(element, references.container);
			const width = element.clientWidth;
			const height = element.clientHeight;
			const borderTopWidth = element.clientTop;
			const borderLeftWidth = element.clientLeft;
			const top = offsetRect.top + borderTopWidth;
			const left = offsetRect.left + borderLeftWidth;

			// 设置选区状态
			this.state.selection.selecting = true;
			this.state.selection.startX = parseInt(element.getAttribute("data-time"));
			this.state.selection.endX = this.state.selection.startX;
			this.state.selection.startY = parseInt(element.getAttribute("data-week"));
			this.state.selection.endY = this.state.selection.startY;
			this.state.selection.top = top;
			this.state.selection.left = left;
			this.state.selection.width = width;
			this.state.selection.height = height;
			this.state.selection.borderTopWidth = borderTopWidth;
			this.state.selection.borderLeftWidth = borderLeftWidth;
			this.state.selection.style.top = top + "px";
			this.state.selection.style.left = left + "px";
			this.state.selection.style.width = width + "px";
			this.state.selection.style.height = height + "px";
		},
		handleSelecting(e) {
			// 判断是否处于选择状态
			if (!this.state.selection.selecting) {
				return;
			}

			const { $refs: references } = this;
			const element = getElementByEvent(e);

			// 判断事件源元素是否存在且为时间单元格
			if (!references.container || !element || !references.container.contains(element) || element.getAttribute("data-role") !== "time") {
				return;
			}

			const endX = parseInt(element.getAttribute("data-time"));
			const endY = parseInt(element.getAttribute("data-week"));

			// 判断当前移动的时间单元格是否为最后一次移动的单元格
			if (endX === this.state.selection.endX && endY === this.state.selection.endY) {
				return;
			}

			const distanceX = Math.abs(endX - this.state.selection.startX);
			const distanceY = Math.abs(endY - this.state.selection.startY);

			const offsetRect = getOffsetRect(element, references.container);
			const top = offsetRect.top + this.state.selection.borderTopWidth;
			const left = offsetRect.left + this.state.selection.borderLeftWidth;
			const width = this.state.selection.width * (distanceX + 1) + this.state.selection.borderLeftWidth * distanceX;
			const height = this.state.selection.height * (distanceY + 1) + this.state.selection.borderTopWidth * distanceY;

			// 设置选区状态
			this.state.selection.endX = endX;
			this.state.selection.endY = endY;
			this.state.selection.style.top = Math.min(this.state.selection.top, top) + "px";
			this.state.selection.style.left = Math.min(this.state.selection.left, left) + "px";
			this.state.selection.style.width = width + "px";
			this.state.selection.style.height = height + "px";
		},
		handleSelectEnd(e) {
			// 判断是否处于选择状态
			if (!this.state.selection.selecting) {
				return;
			}

			// 计算最终的 x 轴起点和终点
			const startX = Math.min(this.state.selection.startX, this.state.selection.endX);
			const endX = Math.max(this.state.selection.startX, this.state.selection.endX);

			// 计算最终的 y 轴起点和终点
			const startY = Math.min(this.state.selection.startY, this.state.selection.endY);
			const endY = Math.max(this.state.selection.startY, this.state.selection.endY);

			// 当框选范围内任一一块未选中时，执行全选
			if (this.isMaybeSelect(startX, endX, startY, endY)) {
				for (let weekIndex = startY; weekIndex <= endY; weekIndex++) {
					const weekValue = this.state.value[weekIndex];

					for (let timeIndex = startX; timeIndex <= endX; timeIndex++) {
						const index = weekValue.indexOf(timeIndex);

						if (index === -1) {
							weekValue.push(timeIndex);
							weekValue.sort((a, b) => a - b);
						}
					}
				}
			}
			// 反之，执行反选
			else {
				for (let weekIndex = startY; weekIndex <= endY; weekIndex++) {
					const weekValue = this.state.value[weekIndex];

					for (let timeIndex = startX; timeIndex <= endX; timeIndex++) {
						const index = weekValue.indexOf(timeIndex);

						if (index > -1) {
							weekValue.splice(index, 1);
						}
					}
				}
			}

			// 设置选区状态
			this.state.selection.selecting = false;
			this.state.selection.startX = 0;
			this.state.selection.endX = 0;
			this.state.selection.startY = 0;
			this.state.selection.endY = 0;
			this.state.selection.top = 0;
			this.state.selection.left = 0;
			this.state.selection.width = 0;
			this.state.selection.height = 0;
			this.state.selection.borderTopWidth = 0;
			this.state.selection.borderLeftWidth = 0;
			this.state.selection.style.top = "0px";
			this.state.selection.style.left = "0px";
			this.state.selection.style.width = "0px";
			this.state.selection.style.height = "0px";

			// 触发选择事件
			this.handleSelect();
		},
		handleClear() {
			this.state.value = this.state.weeks.map(() => []);

			// 触发选择事件
			this.handleSelect();
		},
		handleSelect() {
			let value = "";

			this.state.weeks.forEach((week, weekIndex) => {
				const weekValue = this.state.value[weekIndex];

				this.state.times.forEach((time, timeIndex) => {
					value += weekValue.indexOf(timeIndex) === -1 ? "0" : "1";
				});
			});

			this.$emit("input", value);
			this.$emit("change", value);
			this.dispatch("vui-form-item", "change", value);
		}
	},
	mounted() {
		this.selectStartEvent = addEventListener(document.body, "mousedown", this.handleSelectStart);
		this.selectingEvent = addEventListener(document.body, "mousemove", this.handleSelecting);
		this.selectEndEvent = addEventListener(document.body, "mouseup", this.handleSelectEnd);
	},
	beforeDestroy() {
		this.selectStartEvent && this.selectStartEvent.remove();
		this.selectingEvent && this.selectingEvent.remove();
		this.selectEndEvent && this.selectEndEvent.remove();
	},
	render() {
		const { $props: props, state, t: translate } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "timeroutine");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elAction = `${classNamePrefix}-action`;
		classes.elActionTooltip = `${classNamePrefix}-action-tooltip`;
		classes.elActionPlaceholder = `${classNamePrefix}-action-placeholder`;
		classes.elActionClear = `${classNamePrefix}-action-clear`;
		classes.elSelected = `${classNamePrefix}-selected`;
		classes.elSelection = `${classNamePrefix}-selection`;

		// lang
		let lang = {};

		lang.week = translate("vui.timeroutine.week");
		lang.time = translate("vui.timeroutine.time");
		lang.selected = translate("vui.timeroutine.selected");
		lang.unselected = translate("vui.timeroutine.unselected");
		lang.placeholder = translate("vui.timeroutine.placeholder");
		lang.clear = translate("vui.timeroutine.clear");

		// value
		let value = [];

		state.value.forEach((item, index) => {
			if (item.length === 0) {
				return;
			}

			const chunks = this.chunk(item);
			const week = state.weeks[index];
			let data = "";

			chunks.forEach((chunk, index) => {
				const start = chunk[0] / 2;
				const end = chunk[chunk.length - 1] / 2 + 0.5;
				let formatted = this.format(start) + props.timeSeparator + this.format(end);

				if (index > 0) {
					formatted = props.timeSerieSeparator + " " + formatted;
				}

				data += formatted;
			});

			value.push({ week, data });
		});

		// render
		return (
			<div ref="container" class={classes.el}>
				<table>
					<colgroup>
						<col width="80" />
						{
							state.times.map(time => {
								return (
									<col width="14" />
								);
							})
						}
					</colgroup>
					<thead>
						<tr>
							<th rowspan="2" colspan="1">{lang.week}\{lang.time}</th>
							<th rowspan="1" colspan="24">00:00 - 12:00</th>
							<th rowspan="1" colspan="24">12:00 - 24:00</th>
						</tr>
						<tr>
							{
								state.hours.map(hour => {
									return (
										<th rowspan="1" colspan="2">{hour}</th>
									);
								})
							}
						</tr>
					</thead>
					<tbody>
						{
							state.weeks.map((week, weekIndex) => {
								const weekText = translate("vui.timeroutine.weeks." + week);
								const weekValue = state.value[weekIndex];

								return (
									<tr>
										<th>{weekText}</th>
										{
											state.times.map((time, timeIndex) => {
												const className = weekValue.indexOf(timeIndex) === -1 ? "" : "active";
												const title = weekText + " " + this.format(timeIndex / 2) + props.timeSeparator + this.format(timeIndex / 2 + 0.5);

												return (
													<td class={className} title={title} data-week={weekIndex} data-time={timeIndex} data-role="time"></td>
												);
											})
										}
									</tr>
								);
							})
						}
					</tbody>
					<tfoot>
						<tr>
							<td rowspan="1" colspan="49">
								<div class={classes.elAction}>
									<ul class={classes.elActionTooltip}>
										<li>{lang.selected}</li>
										<li>{lang.unselected}</li>
									</ul>
									<div class={classes.elActionPlaceholder}>{lang.placeholder}</div>
									<a href="javascript:;" class={classes.elActionClear} onClick={this.handleClear}>{lang.clear}</a>
								</div>
								<div v-show={value.length > 0} class={classes.elSelected}>
									{
										value.map(item => {
											return (
												<dl>
													<dt>{translate("vui.timeroutine.weeks." + item.week)}</dt>
													<dd>{item.data}</dd>
												</dl>
											);
										})
									}
								</div>
							</td>
						</tr>
					</tfoot>
				</table>
				<div class={classes.elSelection} style={state.selection.style}></div>
			</div>
		);
	}
};

export default VuiTimeroutine;