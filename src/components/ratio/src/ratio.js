import VuiIcon from "../../icon";
import padEnd from "../../../utils/padEnd";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiRatio = {
	name: "vui-ratio",

	components: {
		VuiIcon
	},

	props: {
		classNamePrefix: {
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
		suffix: {
			type: String,
			default: "%"
		},
		color: {
			type: String,
			default: undefined
		}
	},

	methods: {
		translate(value, precision) {
			let string = String(value);
			let matched = string.match(/^(-?)(\d*)(\.(\d+))?$/);

			if (!matched) {
				return {
					negative: false,
					int: value,
					decimal: ""
				};
			}
			else {
				let negative = matched[1];
				let int = matched[2] || "0";
				let decimal = matched[4] || "";

				if (/^\d+$/.test(precision)) {
					decimal = padEnd(decimal, precision, "0").slice(0, precision);
				}

				if (decimal) {
					decimal = `.${decimal}`;
				}

				return {
					negative: negative ? true : false,
					int,
					decimal
				};
			}
		}
	},

	render(h) {
		let { $slots: slots, $props: props, translate } = this;
		let translated = translate(props.value, props.precision);
		let sort = translated.negative ? "desc" : "asc";
		let iconType = translated.negative ? "arrow-down" : "arrow-up";

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "ratio");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${sort}`]: !props.color && sort
		};
		classes.elPrefix = `${classNamePrefix}-prefix`;
		classes.elSuffix = `${classNamePrefix}-suffix`;
		classes.elValue = `${classNamePrefix}-value`;

		// style
		let styles = {};

		styles.el = {
			color: props.color
		};

		// render
		return (
			<div class={classes.el}>
				<div class={classes.elPrefix}>
					<VuiIcon type={iconType} />
				</div>
				<div class={classes.elValue}>
					<big>{translated.int}</big>
					<small>{translated.decimal}</small>
				</div>
				<div class={classes.elSuffix}>{props.suffix}</div>
			</div>
		);
	}
};

export default VuiRatio;