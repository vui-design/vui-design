import VuiCheckbox from "vui-design/components/checkbox";
import PropTypes from "vui-design/utils/prop-types";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

const VuiTransferPanelBodyListItem = {
	name: "vui-transfer-panel-body-list-item",
	components: {
		VuiCheckbox
	},
	props: {
		classNamePrefix: PropTypes.string,
		data: PropTypes.object.def({}),
		optionKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def("key"),
		selectedKeys: PropTypes.array.def([]),
		option: PropTypes.func.def(option => option.key),
		disabled: PropTypes.bool.def(false)
	},
	methods: {
		handleChange(checked) {
			const { $props: props } = this;
			const key = utils.getOptionKey(props.data, props.optionKey);

			if (props.disabled) {
				return;
			}

			this.$emit("click", checked, key);
		}
	},
	render() {
		const { $props: props, state } = this;
		const { handleChange } = this;

		// key
		const key = utils.getOptionKey(props.data, props.optionKey);

		// content
		let content = props.option(clone(props.data));

		if (!content) {
			content = key;
		}

		// checked
		const checked = props.selectedKeys.indexOf(key) > -1;

		// disabled
		const disabled = props.disabled;

		// classes
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
			<VuiCheckbox class={classes.el} checked={checked} disabled={disabled} onChange={handleChange}>
				{content}
			</VuiCheckbox>
		);
	}
};

export default VuiTransferPanelBodyListItem;