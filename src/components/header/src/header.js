const VuiHeader = {
	name: "vui-header",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-header"
		},
		theme: {
			type: String,
			default: "light",
			validator(value) {
				return ["light", "dark"].indexOf(value) > -1;
			}
		}
	},

	render(h) {
		let { $slots, classNamePrefix, theme } = this;
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${theme}`]: theme
		};

		return (
			<div class={classes}>{$slots.default}</div>
		);
	}
};

export default VuiHeader;