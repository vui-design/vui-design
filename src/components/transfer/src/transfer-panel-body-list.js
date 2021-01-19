import VuiTransferPanelBodyListItem from "./transfer-panel-body-list-item";
import PropTypes from "vui-design/utils/prop-types";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

const VuiTransferPanelBodyList = {
	name: "vui-transfer-panel-body-list",
	components: {
		VuiTransferPanelBodyListItem
	},
	props: {
		classNamePrefix: PropTypes.string,
		data: PropTypes.array.def([]),
		optionKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def("key"),
		selectedKeys: PropTypes.array.def([]),
		option: PropTypes.func.def(option => option.key),
		disabled: PropTypes.bool.def(false)
	},
	data() {
		const { $props: props } = this;
		const state = {
			selectedKeys: clone(props.selectedKeys)
		};

		return {
			state
		};
	},
	watch: {
		selectedKeys(value) {
			this.state.selectedKeys = clone(value);
		}
	},
	methods: {
		handleSelect(checked, key) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			const index = this.state.selectedKeys.indexOf(key);

			if (checked) {
				if (index === -1) {
					this.state.selectedKeys.push(key);
				}
			}
			else {
				if (index > -1) {
					this.state.selectedKeys.splice(index, 1);
				}
			}

			this.$emit("select", clone(this.state.selectedKeys));
		}
	},
	render() {
		const { $props: props, state } = this;
		const { handleSelect } = this;

		// classes
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "list");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		// render
		return (
			<div class={classes.el}>
				{
					props.data.map(item => {
						const key = utils.getOptionKey(item, props.optionKey);

						return (
							<VuiTransferPanelBodyListItem
								key={key}
								classNamePrefix={classNamePrefix}
								data={item}
								optionKey={props.optionKey}
								selectedKeys={props.selectedKeys}
								option={props.option}
								disabled={props.disabled || item.disabled}
								onClick={handleSelect}
							/>
						);
					})
				}
			</div>
		);
	}
};

export default VuiTransferPanelBodyList;