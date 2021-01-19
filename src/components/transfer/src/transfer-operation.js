import VuiButton from "vui-design/components/button";
import PropTypes from "vui-design/utils/prop-types";
import noop from "vui-design/utils/noop";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiTransferOperation = {
	name: "vui-transfer-operation",
	components: {
		VuiButton
	},
	props: {
		classNamePrefix: PropTypes.string,
		disabled: PropTypes.bool.def(false),
		arrowRightText: PropTypes.string,
		arrowLeftText: PropTypes.string,
		arrowRightDisabled: PropTypes.bool.def(true),
		arrowLeftDisabled: PropTypes.bool.def(true),
		moveToRight: PropTypes.func.def(noop),
		moveToLeft: PropTypes.func.def(noop)
	},
	render() {
		const { $props: props, state } = this;

		// arrow icon
		const arrowRightIcon = props.arrowRightText ? undefined : "chevron-right";
		const arrowLeftIcon = props.arrowLeftText ? undefined : "chevron-left";

		// arrow disabled
		const arrowRightDisabled = props.disabled || props.arrowRightDisabled;
		const arrowLeftDisabled = props.disabled || props.arrowLeftDisabled;

		// classes
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "operation");
		let classes = {};

		classes.el = `${classNamePrefix}`;
		classes.elButton = `${classNamePrefix}-button`;

		// render
		return (
			<div class={classes.el}>
				<VuiButton type="primary" size="small" class={classes.elButton} icon={arrowRightIcon} disabled={arrowRightDisabled} onClick={props.moveToRight}>
					{props.arrowRightText}
				</VuiButton>
				<VuiButton type="primary" size="small" class={classes.elButton} icon={arrowLeftIcon} disabled={arrowLeftDisabled} onClick={props.moveToLeft}>
					{props.arrowLeftText}
				</VuiButton>
			</div>
		);
	}
};

export default VuiTransferOperation;