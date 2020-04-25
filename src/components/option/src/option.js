const VuiOption = {
	name: "vui-option",

	props: {
		label: {
			type: [String, Number],
			default: undefined
		},
		value: {
			type: [String, Number],
			default: undefined,
			required: true
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	isOption: true
};

export default VuiOption;