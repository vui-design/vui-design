import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import padEnd from "vui-design/utils/padEnd";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiStatistic = {
	name: "vui-statistic",
	props: {
		classNamePrefix: PropTypes.string,
		title: PropTypes.string,
		extra: PropTypes.string,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		precision: PropTypes.number,
		prefix: PropTypes.string,
		suffix: PropTypes.string,
		formatter: PropTypes.func,
		decimalSeparator: PropTypes.string.def("."),
		groupSeparator: PropTypes.string.def(","),
		headerStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		bodyStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		footerStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	},
	render(h) {
		const { $slots: slots, $props: props } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "statistic");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elHeader = `${classNamePrefix}-header`;
		classes.elBody = `${classNamePrefix}-body`;
		classes.elFooter = `${classNamePrefix}-footer`;
		classes.elTitle = `${classNamePrefix}-title`;
		classes.elExtra = `${classNamePrefix}-extra`;
		classes.elPrefix = `${classNamePrefix}-prefix`;
		classes.elSuffix = `${classNamePrefix}-suffix`;
		classes.elValue = `${classNamePrefix}-value`;

		// title
		const title = slots.title || props.title;

		// extra
		const extra = slots.extra || props.extra;

		// prefix
		const prefix = slots.prefix || props.prefix;

		// suffix
		const suffix = slots.suffix || props.suffix;

		// value
		let value;

		if (is.function(props.formatter)) {
			value = props.formatter(h, props.value);
		}
		else {
			value = String(props.value);

			const matched = value.match(/^(-?)(\d*)(\.(\d+))?$/);

			if (matched) {
				value = [];

				const negative = matched[1];
				let int = matched[2] || "0";
				let decimal = matched[4] || "";

				int = int.replace(/\B(?=(\d{3})+(?!\d))/g, props.groupSeparator);

				if (is.number(props.precision)) {
					decimal = padEnd(decimal, props.precision, "0").slice(0, props.precision);
				}

				if (decimal) {
					decimal = props.decimalSeparator + decimal;
				}

				value.push(
					<big key="int">{negative + int}</big>
				);

				if (decimal) {
					value.push(
						<small key="decimal">{decimal}</small>
					);
				}
			}
		}

		// render
		let children = [];

		if (title || extra) {
			children.push(
				<div class={classes.elHeader} style={props.headerStyle}>
					{
						title && (
							<div class={classes.elTitle}>{title}</div>
						)
					}
					{
						extra && (
							<div class={classes.elExtra}>{extra}</div>
						)
					}
				</div>
			);
		}

		children.push(
			<div class={classes.elBody} style={props.bodyStyle}>
				{
					prefix && (
						<div class={classes.elPrefix}>{prefix}</div>
					)
				}
				<div class={classes.elValue}>{value}</div>
				{
					suffix && (
						<div class={classes.elSuffix}>{suffix}</div>
					)
				}
			</div>
		);

		if (slots.footer) {
			children.push(
				<div class={classes.elFooter} style={props.footerStyle}>{slots.footer}</div>
			);
		}

		return (
			<div class={classes.el}>{children}</div>
		);
	}
};

export default VuiStatistic;