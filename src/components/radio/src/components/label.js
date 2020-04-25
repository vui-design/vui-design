const VuiRadioLabel = {
	name: "vui-radio-label",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-radio"
		}
	},

	render() {
		let { $slots, classNamePrefix } = this;
		let classes = `${classNamePrefix}-label`;

		if (!$slots.default) {
			return;
		}

		return (
			<div class={classes}>{$slots.default}</div>
		);
	}
};

export default VuiRadioLabel;
