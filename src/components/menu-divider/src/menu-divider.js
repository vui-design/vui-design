import is from "../../../utils/is";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiMenuDivider = {
	name: "vui-menu-divider",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		gutter: {
			type: [String, Number],
			default: 10
		}
	},

	render() {
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, gutter } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "menu-divider");
		let style = {};

		if (gutter) {
			style.marginTop = is.string(gutter) ? gutter : `${gutter}px`;
			style.marginBottom = style.marginTop;
		}

		return (
			<div class={`${classNamePrefix}`} style={style}></div>
		);
	}
};

export default VuiMenuDivider;