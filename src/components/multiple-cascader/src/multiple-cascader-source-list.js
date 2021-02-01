import VuiMultipleCascaderSource from "./multiple-cascader-source";
import PropTypes from "vui-design/utils/prop-types";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

const VuiMultipleCascaderSourceList = {
	name: "vui-multiple-cascader-source-list",
	provide() {
		return {
			vuiMultipleCascaderSourceList: this
		};
	},
	components: {
		VuiMultipleCascaderSource
	},
	props: {
		classNamePrefix: PropTypes.string,
		title: PropTypes.func.def(props => ""),
		value: PropTypes.array.def([]),
		options: PropTypes.array.def([]),
		valueKey: PropTypes.string.def("value"),
		childrenKey: PropTypes.string.def("children"),
		formatter: PropTypes.func.def(option => option.key),
		body: PropTypes.func,
		showSelectAll: PropTypes.bool.def(true),
		disabled: PropTypes.bool.def(false),
		locale: PropTypes.object
	},
	data() {
		const { $props: props } = this;
		const state = {
			value: clone(props.value)
		};

		return {
			state
		};
	},
	watch: {
		value(value) {
			this.state.value = clone(value);
		}
	},
	methods: {
		getContainer() {
			return this.$el;
		},
		handleSelect(checked, option) {
			const { $props: props, state } = this;

			if (checked) {
				if (option.children && option.children.length > 0) {
					const options = utils.flatten(option.children, props.childrenKey, true);

					options.forEach(option => {
						const index = this.state.value.findIndex(element => option[props.valueKey] === element);

						if (index > -1) {
							this.state.value.splice(index, 1);
						}
					});
				}

				const index = this.state.value.findIndex(element => option.value === element);

				if (index === -1) {
					this.state.value.push(option.value);
				}
			}
			else {
				const index = this.state.value.findIndex(element => option.value === element);

				if (index > -1) {
					this.state.value.splice(index, 1);
				}
			}

			this.$emit("select", clone(this.state.value));
		}
	},
	render(h) {
		const { $props: props, state, getContainer } = this;
		const { handleSelect } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "source-list");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		// render
		const optionKeys = props.options.map(option => option[props.valueKey]);
		const selectedKeys = optionKeys.filter(optionKey => state.value.indexOf(optionKey) > -1);

		return (
			<div class={classes.el}>
				<VuiMultipleCascaderSource
					classNamePrefix={props.classNamePrefix}
					title={props.title}
					selectedKeys={selectedKeys}
					options={props.options}
					valueKey={props.valueKey}
					childrenKey={props.childrenKey}
					formatter={props.formatter}
					body={props.body}
					showSelectAll={props.showSelectAll}
					disabled={props.disabled}
					locale={props.locale}
					getContainer={getContainer}
				/>
			</div>
		);
	}
};

export default VuiMultipleCascaderSourceList;