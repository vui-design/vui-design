const VuiDropdown = {
	name: "vui-dropdown",

	provide() {
		return {
			vuiDropdown: this
		};
	},

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-dropdown"
		}
	},

	data() {
		return {
			visible: false
		};
	},

	methods: {

	},

	render() {
		let { $slots, classNamePrefix } = this;

		return (
			<div class={`${classNamePrefix}`}>
				<div class={`${classNamePrefix}-trigger`}>{$slots.default}</div>
				<div class={`${classNamePrefix}-dropdown`}>{$slots.menu}</div>
			</div>
		);
	}
};

export default VuiDropdown;