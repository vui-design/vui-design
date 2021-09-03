import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const colors = ["blue", "cyan", "geekblue", "gold", "green", "lime", "magenta", "orange", "pink", "purple", "red", "volcano", "yellow"];

const VuiBadge = {
	name: "vui-badge",
	props: {
		classNamePrefix: PropTypes.string,
		type: PropTypes.oneOf(["default", "primary", "info", "warning", "success", "error"]).def("error"),
		status: PropTypes.oneOf(["default", "processing", "warning", "success", "error"]),
		color: PropTypes.string,
		count: PropTypes.number,
		overflowCount: PropTypes.number.def(99),
		text: PropTypes.string,
		dot: PropTypes.bool.def(false),
		offset: PropTypes.array
	},
	render() {
		const { $slots: slots, $props: props } = this;
		const withPresetColor = props.color && colors.indexOf(props.color) > -1;
		const withCustomColor = props.color && colors.indexOf(props.color) === -1;
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "badge");

		if (props.status || props.color) {
			// class
			let classes = {};

			classes.el = {
				[`${classNamePrefix}`]: true,
				[`${classNamePrefix}-status`]: true,
				[`${classNamePrefix}-status-${props.status}`]: props.status,
				[`${classNamePrefix}-status-${props.color}`]: withPresetColor
			};
			classes.elDot = `${classNamePrefix}-status-dot`;
			classes.elText = `${classNamePrefix}-status-text`;

			// style
			let styles = {};

			if (withCustomColor) {
				styles.elDot = {
					borderColor: props.color,
					backgroundColor: props.color
				};
			}

			// render
			let children = [];

			children.push(
				<i class={classes.elDot} style={styles.elDot}></i>
			);

			if (props.text) {
				children.push(
					<div class={classes.elText}>{props.text}</div>
				);
			}

			return (
				<div class={classes.el}>{children}</div>
			);
		}
		else {
			const alone = slots.default === undefined;

			// class
			let classes = {};

			classes.el = {
				[`${classNamePrefix}`]: true,
				[`${classNamePrefix}-alone`]: alone,
				[`${classNamePrefix}-${props.type}`]: props.type
			};
			classes.elDot = `${classNamePrefix}-dot`;
			classes.elCount = `${classNamePrefix}-count`;

			// offset
			let offset = {};

			if (!alone && props.offset && props.offset.length === 2) {
				const [x, y] = props.offset;

				offset.top = -y + "px";
				offset.right = -x + "px";
			}

			// render
			let children = [];

			if (!alone) {
				children.push(slots.default);
			}

			if (props.dot) {
				if (props.count || props.text) {
					children.push(
						<sup class={classes.elDot} style={offset}></sup>
					);
				}
			}
			else {
				if (props.count) {
					const count = props.count > props.overflowCount ? (props.overflowCount + "+") : props.count;

					children.push(
						<sup class={classes.elCount} style={offset}>{count}</sup>
					);
				}
				else if (props.text) {
					children.push(
						<sup class={classes.elCount} style={offset}>{props.text}</sup>
					);
				}
			}

			return (
				<div class={classes.el}>{children}</div>
			);
		}
	}
};

export default VuiBadge;