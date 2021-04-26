import VuiCheckbox from "vui-design/components/checkbox";
import PropTypes from "vui-design/utils/prop-types";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

const VuiTransferPanelBodyMenuItem = {
	name: "vui-transfer-panel-body-menu-item",
	components: {
		VuiCheckbox
	},
	props: {
		classNamePrefix: PropTypes.string,
		data: PropTypes.object.def({}),
		optionKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def("key"),
		selectedKeys: PropTypes.array.def([]),
		formatter: PropTypes.func.def(option => option.key),
		disabled: PropTypes.bool.def(false)
	},
	methods: {
		handleChange(checked) {
			const { $props: props } = this;
			const optionKey = utils.getOptionKey(props.data, props.optionKey);

			if (props.disabled) {
				return;
			}

			this.$emit("click", checked, optionKey);
		}
	},
	render() {
		const { $props: props, state } = this;
		const { handleChange } = this;

		// optionKey
		const optionKey = utils.getOptionKey(props.data, props.optionKey);

		// content
		let content = props.formatter(clone(props.data));

		if (!content) {
			content = optionKey;
		}

		// checked
		const checked = props.selectedKeys.indexOf(optionKey) > -1;

		// disabled
		const disabled = props.disabled;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "item");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-checked`]: checked,
			[`${classNamePrefix}-disabled`]: disabled
		};
		classes.elCheckbox = `${classNamePrefix}-checkbox`;
		classes.elTitle = `${classNamePrefix}-title`;

		// render
		return (
			<VuiCheckbox class={classes.el} checked={checked} disabled={disabled} validator={false} onChange={handleChange}>
				{content}
			</VuiCheckbox>
		);
	}
};

export default VuiTransferPanelBodyMenuItem;