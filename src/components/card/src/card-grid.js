const VuiCardGrid = {
	name: "vui-card-grid",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-card-grid"
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

export default VuiCardGrid;