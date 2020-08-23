const VuiTabPanel = {
	name: "vui-tab-panel",

	props: {
		icon: {
			type: String,
			default: undefined
		},
		title: {
			type: [String, Number, Function],
			default: undefined
		},
		closable: {
			type: Boolean,
			default: undefined
		},
		disabled: {
			type: Boolean,
			default: false
		}
	}
};

export default VuiTabPanel;