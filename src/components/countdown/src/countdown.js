import { parseToDate, formatter } from "./utils";

const VuiCountdown = {
	name: "vui-countdown",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-countdown"
		},
		title: {
			type: String,
			default: undefined
		},
		prefix: {
			type: String,
			default: undefined
		},
		suffix: {
			type: String,
			default: undefined
		},
		value: {
			type: [String, Number, Date],
			default: undefined
		},
		duration: {
			type: Number,
			default: 1000
		},
		format: {
			type: String,
			default: "HH:mm:ss"
		},
		formatter: {
			type: Function,
			default: formatter
		},
		valueClassName: {
			type: [String, Object, Array],
			default: undefined
		},
		valueStyle: {
			type: [String, Object, Array],
			default: undefined
		}
	},

	data() {
		return {
			countdown: ""
		};
	},

	methods: {
		setTimeout() {
			if (this.duration <= 0) {
				return;
			}

			let current = new Date();
			let target = parseToDate(this.value);

			this.countdown = this.formatter(this.$createElement, current, target, this.format);

			if (current <= target) {
				this.timeout = window.setTimeout(() => {
					this.setTimeout();
				}, this.duration);
			}
			else {
				this.clearTimeout();
			}
		},
		clearTimeout() {
			if (!this.timeout) {
				return;
			}

			clearTimeout(this.timeout);
			this.timeout = null;

			this.$emit("finish");
		}
	},

	mounted() {
		this.setTimeout();
	},

	beforeDestroy() {
		this.clearTimeout();
	},

	render(h) {
		let { $slots, classNamePrefix, title, value, format, formatter, valueClassName, valueStyle } = this;
		let prefix = $slots.prefix || this.prefix;
		let suffix = $slots.suffix || this.suffix;

		return (
			<div class={`${classNamePrefix}`}>
				{title && <div class={`${classNamePrefix}-title`}>{title}</div>}
				<div class={[`${classNamePrefix}-value`, valueClassName]} style={valueStyle}>
					{prefix && <label class={`${classNamePrefix}-value-prefix`}>{prefix}</label>}
					<label class={`${classNamePrefix}-value-main`}>{this.countdown}</label>
					{suffix && <label class={`${classNamePrefix}-value-suffix`}>{suffix}</label>}
				</div>
			</div>
		);
	}
};

export default VuiCountdown;