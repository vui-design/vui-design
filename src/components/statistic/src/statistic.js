import is from "vui-design/utils/is";
import padEnd from "vui-design/utils/padEnd";

const VuiStatistic = {
	name: "vui-statistic",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-statistic"
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
			type: [String, Number],
			default: undefined
		},
		precision: {
			type: Number,
			default: undefined
		},
		formatter: {
			type: Function,
			default: undefined
		}
	},

	render(h) {
		let { $slots, classNamePrefix, title, precision, formatter } = this;
		let prefix = $slots.prefix || this.prefix;
		let suffix = $slots.suffix || this.suffix;
		let main = [];

		if (is.function(formatter)) {
			main = formatter(h, this.value);
		}
		else {
			let value = String(this.value);
			let matched = value.match(/^(-?)(\d*)(\.(\d+))?$/);

			if (!matched) {
				main = value;
			}
			else {
				let negative = matched[1];
				let int = matched[2] || "0";
				let decimal = matched[4] || "";

				int = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

				if (is.number(precision)) {
					decimal = padEnd(decimal, precision, "0").slice(0, precision);
				}

				if (decimal) {
					decimal = `.${decimal}`;
				}

				main.push(
					<big key="int">{negative + int}</big>
				);

				if (decimal) {
					main.push(
						<small key="decimal">{decimal}</small>
					);
				}
			}
		}

		return (
			<div class={`${classNamePrefix}`}>
				<div class={`${classNamePrefix}-header`}>
					{title && <div class={`${classNamePrefix}-title`}>{title}</div>}
					{$slots.extra && <div class={`${classNamePrefix}-extra`}>{$slots.extra}</div>}
				</div>
				<div class={`${classNamePrefix}-main`}>
					{prefix && <label class={`${classNamePrefix}-prefix`}>{prefix}</label>}
					<label class={`${classNamePrefix}-value`}>{main}</label>
					{suffix && <label class={`${classNamePrefix}-suffix`}>{suffix}</label>}
				</div>
			</div>
		);
	}
};

export default VuiStatistic;