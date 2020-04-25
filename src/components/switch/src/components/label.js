const VuiSwitchLabel = {
	name: "vui-switch-label",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-switch"
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

export default VuiSwitchLabel;
