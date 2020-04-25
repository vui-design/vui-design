import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VcOptionGroup = {
	name: "vui-option-group",

	provide() {
		return {
			vcOptionGroup: this
		};
	},

	props: {
		label: {
			type: String,
			default: undefined,
			required: true
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	render() {
		let { vcSelect, $slots: slots, classNamePrefix: customizedClassNamePrefix, label } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "option-group");

		return (
			<div class={`${classNamePrefix}`}>
				<div class={`${classNamePrefix}-header`}>{label}</div>
				<div class={`${classNamePrefix}-body`}>{slots.default}</div>
			</div>
		)
	}
};

export default VcOptionGroup;