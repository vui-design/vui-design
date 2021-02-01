import VuiEmpty from "vui-design/components/empty";
import Locale from "vui-design/mixins/locale";
import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiMultipleCascaderEmpty = {
	name: "vui-multiple-cascader-empty",
	components: {
		VuiEmpty
	},
	mixins: [
		Locale
	],
	props: {
		classNamePrefix: PropTypes.string,
		description: PropTypes.string
	},
	render() {
		const { $props: props } = this;

		// description
		const description = props.description ? props.description : this.t("vui.multipleCascader.notFound");

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "empty");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		// render
		return (
			<div class={classes.el}>
				<VuiEmpty description={description} />
			</div>
		);
	}
};

export default VuiMultipleCascaderEmpty;