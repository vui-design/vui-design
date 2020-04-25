import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

export default {
	name: "vui-cascader-dropdown",

	inject: {
		vuiCascader: {
			default: undefined
		}
	},

	provide() {
		return {
			vuiCascaderDropdown: this
		};
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		}
	},

	methods: {
		handleMousedown(e) {
			e.preventDefault();
		}
	},

	render(h) {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix } = this;
		let { handleMousedown } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "cascader-dropdown");

		return (
			<div class={`${classNamePrefix}`} onMousedown={handleMousedown}>
				{slots.default}
			</div>
		);
	}
};