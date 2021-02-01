import VuiTransferPanelBodyMenuItem from "./transfer-panel-body-menu-item";
import PropTypes from "vui-design/utils/prop-types";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

const VuiTransferPanelBodyMenu = {
	name: "vui-transfer-panel-body-menu",
	components: {
		VuiTransferPanelBodyMenuItem
	},
	props: {
		classNamePrefix: PropTypes.string,
		options: PropTypes.array.def([]),
		optionKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).def("key"),
		selectedKeys: PropTypes.array.def([]),
		formatter: PropTypes.func.def(option => option.key),
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
		handleSelect(checked, optionKey) {
			const { $props: props } = this;

			if (props.disabled) {
				return;
			}

			const index = this.state.selectedKeys.indexOf(optionKey);

			if (checked) {
				if (index === -1) {
					this.state.selectedKeys.push(optionKey);
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

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "menu");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		// render
		return (
			<div class={classes.el}>
				{
					props.options.map(option => {
						const optionKey = utils.getOptionKey(option, props.optionKey);

						return (
							<VuiTransferPanelBodyMenuItem
								key={optionKey}
								classNamePrefix={classNamePrefix}
								data={option}
								optionKey={props.optionKey}
								selectedKeys={props.selectedKeys}
								formatter={props.formatter}
								disabled={props.disabled || option.disabled}
								onClick={handleSelect}
							/>
						);
					})
				}
			</div>
		);
	}
};

export default VuiTransferPanelBodyMenu;