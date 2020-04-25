import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiBreadcrumb = {
	name: "vui-breadcrumb",

	provide() {
		return {
			vuiBreadcrumb: this
		};
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		separator: {
			type: String,
			default: "/"
		}
	},

	render() {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "breadcrumb");

		return (
			<div class={`${classNamePrefix}`}>
				{slots.default}
			</div>
		);
	}
};

export default VuiBreadcrumb;