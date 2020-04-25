const VuiContent = {
	name: "vui-content",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-content"
		}
	},

	render(h) {
		let { $slots, classNamePrefix } = this;

		return (
			<div class={`${classNamePrefix}`}>
				{$slots.default}
			</div>
		);
	}
};

export default VuiContent;