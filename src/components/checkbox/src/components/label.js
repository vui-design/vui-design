const VuiCheckboxLabel = {
	name: "vui-checkbox-label",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-checkbox"
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

export default VuiCheckboxLabel;
