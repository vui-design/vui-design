const VuiTimelineItem = {
	name: "vui-timeline-item",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-timeline-item"
		},
		color: {
			type: String,
			default: "blue"
		}
	},

	data() {
		return {
			colors: ["gray", "blue", "yellow", "green", "red"]
		};
	},

	computed: {
		withPresetColor() {
			return this.color && this.colors.indexOf(this.color) > -1;
		},
		withCustomColor() {
			return this.color && this.colors.indexOf(this.color) === -1;
		}
	},

	render() {
		let { $slots, classNamePrefix, color, withPresetColor, withCustomColor } = this;

		// classes
		let classes = {};

		classes.root = {
			[`${classNamePrefix}`]: true
		};
		classes.tail = {
			[`${classNamePrefix}-tail`]: true
		};
		classes.header = {
			[`${classNamePrefix}-header`]: true,
			[`${classNamePrefix}-header-custom`]: $slots.dot,
			[`${classNamePrefix}-header-${color}`]: withPresetColor
		};
		classes.body = {
			[`${classNamePrefix}-body`]: true
		};

		// styles
		let styles = {};

		if (withCustomColor) {
			styles.header = {
				borderColor: color,
				color
			};
		}

		// render
		return (
			<li class={classes.root}>
				<div class={classes.tail}></div>
				<div class={classes.header} style={styles.header}>{$slots.dot}</div>
				<div class={classes.body}>{$slots.default}</div>
			</li>
		);
	}
};

export default VuiTimelineItem;