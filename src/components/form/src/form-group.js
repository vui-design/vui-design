import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiFormGroup = {
	name: "vui-form-group",
	props: {
		classNamePrefix: PropTypes.string,
		title: PropTypes.string
	},
	render() {
		const { $slots: slots, $props: props } = this;

		// title
		const title = slots.title || props.title;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "form-group");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elTitle = `${classNamePrefix}-title`;

		// render
		return (
			<fieldset class={classes.el}>
				<legend class={classes.elTitle}>{title}</legend>
				{slots.default}
			</fieldset>
		);
	}
};

export default VuiFormGroup;