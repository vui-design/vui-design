import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const types = ["default", "primary", "info", "warning", "success", "error"];
const statuses = ["default", "processing", "warning", "success", "error"];
const colors = ["blue", "green", "red", "yellow", "pink", "magenta", "volcano", "orange", "gold", "lime", "cyan", "geekblue", "purple"];

const VuiBadge = {
	name: "vui-badge",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		type: {
			type: String,
			default: "error",
			validator: value => types.indexOf(value) > -1
		},
		status: {
			type: String,
			default: undefined,
			validator: value => statuses.indexOf(value) > -1
		},
		color: {
			type: String,
			default: undefined,
		},
		count: {
			type: Number,
			default: undefined
		},
		overflowCount: {
			type: Number,
			default: 99
		},
		text: {
			type: String,
			default: undefined
		},
		dot: {
			type: Boolean,
			default: false
		},
		offset: {
			type: Array,
			default: undefined
		}
	},

	render() {
		let { $slots: slots, $props: props } = this;
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "badge");

		if (props.status || props.color) {
			// class
			let classes = {};

			classes.el = {
				[`${classNamePrefix}`]: true,
				[`${classNamePrefix}-status`]: true,
				[`${classNamePrefix}-status-${props.status}`]: props.status,
				[`${classNamePrefix}-status-${props.color}`]: props.color && colors.indexOf(props.color) > -1
			};
			classes.elDot = `${classNamePrefix}-status-dot`;
			classes.elText = `${classNamePrefix}-status-text`;

			// style
			let styles = {};

			if (props.color && colors.indexOf(props.color) === -1) {
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
				<div class={classes.el}>
					{children}
				</div>
			);
		}
		else {
			let alone = slots.default === undefined;

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
				let [x, y] = props.offset;

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
					let count = props.count > props.overflowCount ? (props.overflowCount + "+") : props.count;

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
				<div class={classes.el}>
					{children}
				</div>
			);
		}
	}
};

export default VuiBadge;