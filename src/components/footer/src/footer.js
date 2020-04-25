const VuiFooter = {
	name: "vui-footer",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-footer"
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

export default VuiFooter;