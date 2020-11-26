import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

const VuiCountdown = {
	name: "vui-countdown",
	props: {
		classNamePrefix: PropTypes.string,
		title: PropTypes.string,
		extra: PropTypes.string,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),
		prefix: PropTypes.string,
		suffix: PropTypes.string,
		formatter: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def("HH:mm:ss"),
		milliseconds: PropTypes.number.def(1000 / 30),
		headerStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		bodyStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
		footerStyle: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
	},
	data() {
		const state = {
			value: undefined
		};

		return {
			state
		};
	},
	methods: {
		start() {
			const { $props: props } = this;

			if (props.milliseconds <= 0) {
				return;
			}

			window.clearInterval(this.countdown);
			this.countdown = window.setInterval(() => {
				const current = utils.now();
				const target = utils.parser(props.value);
				let value;

				if (is.function(props.formatter)) {
					value = props.formatter(current, target);
				}
				else {
					value = utils.formatter(current, target, props.formatter);
				}

				this.state.value = value;

				if (current > target) {
					this.stop();
				}
			}, props.milliseconds);
		},
		stop() {
			const { $props: props } = this;

			if (!this.countdown) {
				return;
			}

			window.clearInterval(this.countdown);
			this.countdown = undefined;

			const current = utils.now();
			const target = utils.parser(props.value);

			if (target < current) {
				this.$emit("finish");
			}
		}
	},
	mounted() {
		this.start();
	},
	updated() {
		this.start();
	},
	beforeDestroy() {
		this.stop();
	},
	render(h) {
		const { $slots: slots, $props: props, state } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "countdown");
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
				<div class={classes.elValue}>{state.value}</div>
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

export default VuiCountdown;