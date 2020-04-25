const VuiTimeline = {
	name: "vui-timeline",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-timeline"
		},
		mode: {
			type: String,
			default: "left",
			validator: value => ["left", "alternate", "right"].indexOf(value) > -1
		},
		pending: {
			type: Boolean,
			default: false
		}
	},

	render() {
		let { $slots, classNamePrefix, mode, pending } = this;
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${mode}`]: true,
			[`${classNamePrefix}-pending`]: pending
		};

		return (
			<ul class={classes}>{$slots.default}</ul>
		);
	}
};

export default VuiTimeline;