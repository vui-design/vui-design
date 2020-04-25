import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiLayout = {
	name: "vui-layout",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		withSider: {
			type: Boolean,
			default: false
		}
	},

	render(h) {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix } = this;

		// withSider
		let withSider = this.withSider;

		withSider = slots.default && slots.default.some(vNode => {
			return vNode.componentOptions && vNode.componentOptions.tag === "vui-sider";
		});

		// classes
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "layout");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-with-sider`]: withSider
		};

		// render
		return (
			<div class={classes.el}>{slots.default}</div>
		);
	}
};

export default VuiLayout;