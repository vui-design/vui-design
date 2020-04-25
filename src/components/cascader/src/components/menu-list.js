import VuiCascaderMenu from "./menu";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import { getMenusByValue } from "../utils";

export default {
	name: "vui-cascader-menu-list",

	inject: {
		vuiCascader: {
			default: undefined
		}
	},

	provide() {
		return {
			vuiCascaderMenuList: this
		};
	},

	components: {
		VuiCascaderMenu
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		value: {
			type: Array,
			default: () => []
		},
		options: {
			type: Array,
			default: () => []
		},
		keyNames: {
			type: Object,
			default: () => ({ label: "label", value: "value", children: "children" })
		},
		changeOnSelect: {
			type: Boolean,
			default: false
		},
		visible: {
			type: Boolean,
			default: false
		}
	},

	data() {
		let state = this.getDerivedStateFromProps(this.$props);

		return {
			state: {
				value: state.value,
				menus: state.menus
			}
		};
	},

	watch: {
		value(value) {
			let state = this.getDerivedStateFromProps(this.$props);

			this.state.value = state.value;
			this.state.menus = state.menus;
		},
		options(value) {
			let state = this.getDerivedStateFromProps(this.$props);

			this.state.value = state.value;
			this.state.menus = state.menus;
		},
		visible(value) {
			if (!value) {
				return;
			}

			let state = this.getDerivedStateFromProps(this.$props);

			this.state.value = state.value;
			this.state.menus = state.menus;
		}
	},

	methods: {
		getDerivedStateFromProps(props) {
			let value = clone(props.value);
			let menus = getMenusByValue({
				value: props.value.map(option => option[props.keyNames.value]),
				options: props.options,
				keyName: props.keyNames.value
			});

			return {
				value,
				menus
			};
		},
		handleSelect(level, option) {
			let { $props: props, state } = this;
			let value = state.value.slice(0, level).concat(option);
			let menus = getMenusByValue({
				value: value.map(item => item[props.keyNames.value]),
				options: props.options,
				keyName: props.keyNames.value
			});

			this.state.value = value;
			this.state.menus = menus;

			if (!props.changeOnSelect && option.children) {
				return;
			}

			this.$emit("select", clone(value));
		}
	},

	render(h) {
		let { $props: props, state } = this;
		let { handleSelect } = this;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "cascader-menu-list");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		// render
		let children = state.menus.map((options, index) => {
			return (
				<VuiCascaderMenu
					key={index}
					classNamePrefix={props.classNamePrefix}
					level={index}
					value={state.value[index]}
					options={options}
					keyNames={props.keyNames}
					visible={props.visible}
					onSelect={handleSelect}
				/>
			);
		});

		return (
			<div class={classes.el}>
				{children}
			</div>
		);
	}
};