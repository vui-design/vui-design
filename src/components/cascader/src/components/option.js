import VuiIcon from "vui-design/components/icon";
import scrollIntoView from "vui-design/utils/scrollIntoView";
import clone from "vui-design/utils/clone";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

export default {
	name: "vui-cascader-option",

	inject: {
		vuiCascader: {
			default: undefined
		},
		vuiCascaderDropdown: {
			default: undefined
		},
		vuiCascaderMenuList: {
			default: undefined
		},
		vuiCascaderMenu: {
			default: undefined
		}
	},

	components: {
		VuiIcon
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		data: {
			type: Object,
			default: () => ({})
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

	watch: {
		visible: {
			immediate: true,
			handler(value) {
				let { vuiCascaderMenu, $el: target, $props: props } = this;
				let { $el: view } = vuiCascaderMenu;
				let { label: labelKey, value: valueKey, children: childrenKey } = props.keyNames;

				if (!value || !view || !target || !(vuiCascaderMenu.state.hoveredValue === props.data[valueKey])) {
					return;
				}

				scrollIntoView(view, target);
			}
		}
	},

	methods: {
		handleHover(e) {
			let { $props: props } = this;

			if (props.data.disabled) {
				return;
			}

			this.$emit("hover", clone(props.data));
		},
		handleClick(e) {
			let { $props: props } = this;

			if (props.data.disabled) {
				return;
			}

			this.$emit("click", clone(props.data));
		}
	},

	render(h) {
		let { vuiCascader, vuiCascaderMenu, $props: props } = this;
		let { label: labelKey, value: valueKey, children: childrenKey } = props.keyNames;
		let { handleHover, handleClick } = this;

		// value
		let value = props.data[valueKey];

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "cascader-option");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-hovered`]: vuiCascaderMenu.state.hoveredValue === value,
			[`${classNamePrefix}-selected`]: vuiCascaderMenu.state.selectedValue === value,
			[`${classNamePrefix}-disabled`]: props.data.disabled
		};
		classes.elIcon = `${classNamePrefix}-icon`;

		// render
		let children = [];
		let scopedSlot = vuiCascader.$scopedSlots.option;

		if (scopedSlot) {
			children.push(scopedSlot({
				option: clone(props.data)
			}));
		}
		else {
			children.push(props.data[labelKey]);
		}

		if (props.data[childrenKey]) {
			children.push(
				<VuiIcon type="chevron-right" class={classes.elIcon} />
			);
		}

		return (
			<div class={classes.el} onMouseenter={handleHover} onClick={handleClick}>
				{children}
			</div>
		);
	}
};