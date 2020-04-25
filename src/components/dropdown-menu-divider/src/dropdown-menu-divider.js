import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiDropdownMenuDivider = {
	name: "vui-dropdown-menu-divider",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		gutter: {
			type: [String, Number],
			default: 5
		}
	},

	render() {
		const { $slots: slots, classNamePrefix: customizedClassNamePrefix, gutter } = this;
		const classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "dropdown-menu-divider");
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

export default VuiDropdownMenuDivider;