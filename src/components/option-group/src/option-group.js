const VuiOptionGroup = {
	name: "vui-option-group",

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

	isOptionGroup: true
};

export default VuiOptionGroup;