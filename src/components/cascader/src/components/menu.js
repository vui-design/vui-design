import VuiCascaderOption from "./option";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

export default {
	name: "vui-cascader-menu",

	inject: {
		vuiCascader: {
			default: undefined
		},
		vuiCascaderDropdown: {
			default: undefined
		},
		vuiCascaderMenuList: {
			default: undefined
		}
	},

	provide() {
		return {
			vuiCascaderMenu: this
		};
	},

	components: {
		VuiCascaderOption
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		level: {
			type: Number,
			default: 0
		},
		value: {
			type: Object,
			default: () => ({})
		},
		options: {
			type: Array,
			default: () => []
		},
		keyNames: {
			type: Object,
			default: () => ({ label: "label", value: "value", children: "children" })
		},
		visible: {
			type: Boolean,
			default: false
		}
	},

	data() {
		let { $props: props } = this;
		let { value, keyNames } = props;
		let hoveredValue = value[keyNames.value];
		let selectedValue = value[keyNames.value];

		return {
			state: {
				hoveredValue,
				selectedValue
			}
		};
	},

	watch: {
		value(value) {
			let { $props: props } = this;
			let { keyNames } = props;

			this.state.hoveredValue = value[keyNames.value];
			this.state.selectedValue = value[keyNames.value];
		}
	},

	methods: {
		handleHoverOption(option) {
			let { $props: props } = this;
			let { keyNames } = props;

			this.state.hoveredValue = option[keyNames.value];
		},
		handleClickOption(option) {
			let { $props: props } = this;
			let { keyNames } = props;

			this.state.selectedValue = option[keyNames.value];
			this.$emit("select", props.level, clone(option));
		}
	},

	render(h) {
		let { $props: props } = this;
		let { handleHoverOption, handleClickOption } = this;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "cascader-menu");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		// render
		let children = props.options.map(option => {
			return (
				<VuiCascaderOption
					classNamePrefix={props.classNamePrefix}
					data={option}
					keyNames={props.keyNames}
					visible={props.visible}
					onHover={handleHoverOption}
					onClick={handleClickOption}
				/>
			);
		});

		return (
			<div class={`${classNamePrefix}`}>
				{children}
			</div>
		);
	}
};