const VuiLayout = {
	name: "vui-layout",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-layout"
		},
		direction: {
			type: String,
			default: undefined
		}
	},

	render(h) {
		let { $slots, classNamePrefix } = this;

		let direction;
		let hasSider = $slots.default && $slots.default.some(vnode => {
			return vnode.componentOptions && vnode.componentOptions.tag === "vui-sider";
		});

		if (this.direction) {
			direction = this.direction;
		}
		else if (hasSider) {
			direction = "horizontal";
		}
		else {
			direction = "vertical";
		}

		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${direction}`]: direction
		};

		return (
			<div class={classes}>{$slots.default}</div>
		);
	}
};

export default VuiLayout;