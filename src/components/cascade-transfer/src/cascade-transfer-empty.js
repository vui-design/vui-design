import VuiEmpty from "../../empty";
import Locale from "../../../mixins/locale";
import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiCascadeTransferEmpty = {
	name: "vui-cascade-transfer-empty",
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
		const description = props.description ? props.description : this.t("vui.cascadeTransfer.notFound");

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

export default VuiCascadeTransferEmpty;