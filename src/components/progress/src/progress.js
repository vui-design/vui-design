import VuiIcon from "vui-design/components/icon";
import is from "vui-design/utils/is";

const VuiProgress = {
	name: "vui-progress",

	components: {
		VuiIcon
	},

	props: {
		// 样式类名前缀
		classNamePrefix: {
			type: String,
			default: "vui-progress"
		},
		// 进度条类型 line/circle/dashboard
		type: {
			type: String,
			default: "line",
			validator: value => ["line", "circle", "dashboard"].indexOf(value) > -1
		},
		// 进度条尺寸 small/medium/large
		size: {
			type: String,
			default: "medium",
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		// 进度条进度 0-100
		percentage: {
			type: Number,
			default: 0,
			validator: value => value >= 0 && value <= 100
		},
		// 进度条状态 normal/active/exception/success
		status: {
			type: String,
			default: "normal",
			validator: value => ["normal", "active", "exception", "success"].indexOf(value) > -1
		},
		// 进度条颜色，会覆盖 status 状态下的默认颜色
		color: {
			type: String,
			default: undefined
		},
		// 进度条内容的模板函数
		format: {
			type: Function,
			default: undefined
		},
		// 画布尺寸，单位 px
		canvas: {
			type: Number,
			default: undefined
		},
		// 线条尺寸，单位 px
		stroke: {
			type: Number,
			default: undefined
		},
		// 线条边缘形状 round/square
		linecap: {
			type: String,
			default: "round",
			validator: value => ["round", "square"].indexOf(value) > -1
		},
		// 是否显示进度数值或状态图标
		showInfo: {
			type: Boolean,
			default: true
		}
	},

	render(h) {
		let { classNamePrefix, type, size, percentage, status, color, format, canvas, stroke, linecap, showInfo } = this;

		// status
		if (percentage === 100 && status === "normal") {
			status = "success";
		}

		// canvas
		if (type !== "line" && !canvas) {
			let defaultCanvases = {
				small: 80,
				medium: 120,
				large: 160
			};

			canvas = defaultCanvases[size];
		}

		// stroke
		if (!stroke) {
			let defaultStrokes = {
				small: 6,
				medium: 8,
				large: 10
			};

			stroke = defaultStrokes[size];
		}

		// classes
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${type}`]: type,
			[`${classNamePrefix}-${size}`]: size,
			[`${classNamePrefix}-status-${status}`]: status,
			[`${classNamePrefix}-with-info`]: showInfo
		};

		// render
		if (type === "line") {
			let lineStrokeWidth = stroke;
			let lineStrokeColor = color;
			let lineStrokeLinecap = linecap;

			let lineTrackStyle = {
				height: `${lineStrokeWidth}px`,
				borderRadius: `${lineStrokeLinecap === "round" ? lineStrokeWidth : 0}px`
			};
			let lineThumbStyle = {
				width: `${percentage}%`,
				height: `${lineStrokeWidth}px`,
				borderRadius: `${lineStrokeLinecap === "round" ? lineStrokeWidth : 0}px`,
				backgroundColor: lineStrokeColor
			};

			let children = [];

			children.push(
				<div class={`${classNamePrefix}-main`}>
					<div class={`${classNamePrefix}-main-track`} style={lineTrackStyle}>
						<div class={`${classNamePrefix}-main-thumb`} style={lineThumbStyle}></div>
					</div>
				</div>
			);

			if (showInfo) {
				let lineInfo;
				let lineInfoStyles = {
					color: status !== "normal" && lineStrokeColor ? lineStrokeColor : undefined
				};

				if (format) {
					lineInfo = format(percentage);
				}
				else if (status === "exception") {
					lineInfo = (
						<VuiIcon type="crossmark-circle-filled" />
					);
				}
				else if (status === "success") {
					lineInfo = (
						<VuiIcon type="checkmark-circle-filled" />
					);
				}
				else {
					lineInfo = `${percentage}%`;
				}

				children.push(
					<div class={`${classNamePrefix}-info`} style={lineInfoStyles}>
						{lineInfo}
					</div>
				);
			}

			return (
				<div class={classes}>
					{children}
				</div>
			);
		}
		else if (type === "circle") {
			let circleStrokeWidth = Number((stroke / canvas * 100).toFixed(2));
			let circleStrokeColor = color;
			let circleStrokeLinecap = linecap;
			let radius = 50 - circleStrokeWidth / 2;
			let perimeter = 2 * Math.PI * radius;
			let directive = `M 50,50 m 0,-${radius} a ${radius},${radius} 0 1 1 0,${radius * 2} a ${radius},${radius} 0 1 1 0,-${radius * 2}`;

			let circleTrackStyle = {
				strokeWidth: `${circleStrokeWidth}px`,
				strokeLinecap: circleStrokeLinecap,
				strokeDasharray: `${perimeter}px, ${perimeter}px`,
				strokeDashoffset: `0px`
			};
			let circleThumbStyle = {
				stroke: circleStrokeColor,
				strokeWidth: `${percentage === 0 ? 0 : circleStrokeWidth}px`,
				strokeLinecap: circleStrokeLinecap,
				strokeDasharray: `${percentage / 100 * perimeter}px, ${perimeter}px`,
				strokeDashoffset: `0px`,
				transition: `stroke 0.2s ease 0s, stroke-width 0s ease ${percentage === 0 ? 0.2 : 0}s, stroke-dasharray 0.2s ease 0s, stroke-dashoffset 0.2s ease 0s`
			};

			let children = [];

			children.push(
				<svg viewBox={`0 0 100 100`} class={`${classNamePrefix}-main`}>
					<path class={`${classNamePrefix}-main-track`} d={directive} style={circleTrackStyle}></path>
					<path class={`${classNamePrefix}-main-thumb`} d={directive} style={circleThumbStyle}></path>
				</svg>
			);

			if (showInfo) {
				let circleInfo;
				let circleInfoStyles = {
					color: status !== "normal" && circleStrokeColor ? circleStrokeColor : undefined
				};

				if (format) {
					circleInfo = format(percentage);
				}
				else if (status === "exception") {
					circleInfo = (
						<VuiIcon type="crossmark" />
					);
				}
				else if (status === "success") {
					circleInfo = (
						<VuiIcon type="checkmark" />
					);
				}
				else {
					circleInfo = `${percentage}%`;
				}

				children.push(
					<div class={`${classNamePrefix}-info`} style={circleInfoStyles}>
						{circleInfo}
					</div>
				);
			}

			return (
				<div class={classes} style={{width: `${canvas}px`, height: `${canvas}px`}}>
					{children}
				</div>
			);
		}
		else if (type === "dashboard") {
			let dashboardStrokeWidth = Number((stroke / canvas * 100).toFixed(2));
			let dashboardStrokeColor = color;
			let dashboardStrokeLinecap = linecap;
			let radius = 50 - dashboardStrokeWidth / 2;
			let perimeter = 2 * Math.PI * radius;
			let directive = `M 50,50 m 0,${radius} a ${radius},${radius} 0 1 1 0,-${radius * 2} a ${radius},${radius} 0 1 1 0,${radius * 2}`;

			let dashboardTrackStyle = {
				strokeWidth: `${dashboardStrokeWidth}px`,
				strokeLinecap: dashboardStrokeLinecap,
				strokeDasharray: `${perimeter - 75}px, ${perimeter}px`,
				strokeDashoffset: `-${75 / 2}px`
			};
			let dashboardThumbStyle = {
				stroke: dashboardStrokeColor,
				strokeWidth: `${percentage === 0 ? 0 : dashboardStrokeWidth}px`,
				strokeLinecap: dashboardStrokeLinecap,
				strokeDasharray: `${percentage / 100 * (perimeter - 75)}px, ${perimeter}px`,
				strokeDashoffset: `-${75 / 2}px`,
				transition: `stroke 0.2s ease 0s, stroke-width 0s ease ${percentage === 0 ? 0.2 : 0}s, stroke-dasharray 0.2s ease 0s, stroke-dashoffset 0.2s ease 0s`
			};

			let children = [];

			children.push(
				<svg viewBox={`0 0 100 100`} class={`${classNamePrefix}-main`}>
					<path class={`${classNamePrefix}-main-track`} d={directive} style={dashboardTrackStyle}></path>
					<path class={`${classNamePrefix}-main-thumb`} d={directive} style={dashboardThumbStyle}></path>
				</svg>
			);

			if (showInfo) {
				let dashboardInfo;
				let dashboardInfoStyles = {
					color: status !== "normal" && dashboardStrokeColor ? dashboardStrokeColor : undefined
				};

				if (format) {
					dashboardInfo = format(percentage);
				}
				else if (status === "exception") {
					dashboardInfo = (
						<VuiIcon type="crossmark" />
					);
				}
				else if (status === "success") {
					dashboardInfo = (
						<VuiIcon type="checkmark" />
					);
				}
				else {
					dashboardInfo = `${percentage}%`;
				}

				children.push(
					<div class={`${classNamePrefix}-info`} style={dashboardInfoStyles}>
						{dashboardInfo}
					</div>
				);
			}

			return (
				<div class={classes} style={{width: `${canvas}px`, height: `${canvas}px`}}>
					{children}
				</div>
			);
		}
	}
};

export default VuiProgress;