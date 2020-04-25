const VuiBadge = {
	name: "vui-badge",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-badge"
		},
		type: {
			type: String,
			default: "error",
			validator(value) {
				return ["default", "primary", "info", "warning", "success", "error"].indexOf(value) > -1;
			}
		},
		status: {
			type: String,
			default: undefined,
			validator(value) {
				return ["default", "processing", "warning", "success", "error"].indexOf(value) > -1;
			}
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

	computed: {
		alone() {
			return this.$slots.default === undefined;
		}
	},

	methods: {
		drawBadge() {
			let { $slots, classNamePrefix, alone, type, count, overflowCount, text, dot, offset } = this;
			let classes = {};
			let styles = {};
			let children = [];

			classes.el = {
				[`${classNamePrefix}`]: true,
				[`${classNamePrefix}-alone`]: alone,
				[`${classNamePrefix}-${type}`]: type
			};
			classes.dot = `${classNamePrefix}-dot`;
			classes.count = `${classNamePrefix}-count`;

			if (!alone && offset && offset.length === 2) {
				styles.top = -offset[1] + "px";
				styles.right = -offset[0] + "px";
			}

			children.push($slots.default);

			if (dot) {
				if (count || text) {
					children.push(
						<sup class={classes.dot} style={styles}></sup>
					);
				}
			}
			else {
				if (count) {
					children.push(
						<sup class={classes.count} style={styles}>{count <= overflowCount ? count : (overflowCount + "+")}</sup>
					);
				}
				else if (text) {
					children.push(
						<sup class={classes.count} style={styles}>{text}</sup>
					);
				}
			}

			return (
				<div class={classes.el}>
					{children}
				</div>
			);
		},
		drawBadgeStatus() {
			let { classNamePrefix, status, text } = this;
			let classes = {};
			let children = [];

			classes.el = {
				[`${classNamePrefix}-status`]: true,
				[`${classNamePrefix}-status-${status}`]: status
			};
			classes.dot = `${classNamePrefix}-status-dot`;
			classes.text = `${classNamePrefix}-status-text`;

			children.push(
				<i class={classes.dot}></i>
			);

			if (text) {
				children.push(
					<div class={classes.text}>{text}</div>
				);
			}

			return (
				<div class={classes.el}>
					{children}
				</div>
			);
		}
	},

	render() {
		return this.status ? this.drawBadgeStatus() : this.drawBadge();
	}
};

export default VuiBadge;