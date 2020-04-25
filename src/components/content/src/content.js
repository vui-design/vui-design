import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiContent = {
	name: "vui-content",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		}
	},

	render(h) {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "content");

		return (
			<div class={`${classNamePrefix}`}>
				{slots.default}
			</div>
		);
	}
};

export default VuiContent;