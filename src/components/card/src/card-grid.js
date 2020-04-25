import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiCardGrid = {
	name: "vui-card-grid",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		}
	},

	isCardGrid: true,

	render(h) {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "card-grid");

		return (
			<div class={`${classNamePrefix}`}>
				{slots.default}
			</div>
		);
	}
};

export default VuiCardGrid;