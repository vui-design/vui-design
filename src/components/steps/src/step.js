const VuiStep = {
	name: "vui-step",

	props: {
		icon: {
			type: String,
			default: undefined
		},
		title: {
			type: String,
			default: undefined
		},
		description: {
			type: String,
			default: undefined
		},
		status: {
			type: String,
			default: undefined,
			validator: value => ["wait", "process", "finish", "error"].indexOf(value) > -1
		}
	}
};

export default VuiStep;