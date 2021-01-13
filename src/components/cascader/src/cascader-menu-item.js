import VuiIcon from "vui-design/components/icon";
import PropTypes from "vui-design/utils/prop-types";
import clone from "vui-design/utils/clone";
import scrollIntoView from "vui-design/utils/scrollIntoView";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import utils from "./utils";

export default {
	name: "vui-cascader-menu-item",
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
		classNamePrefix: PropTypes.string,
		data: PropTypes.object.def({}),
		optionKeys: PropTypes.object.def(utils.optionKeys),
		dangerouslyUseHTMLString: PropTypes.bool.def(false)
	},
	computed: {
		visible() {
			return this.vuiCascaderDropdown.visible;
		}
	},
	watch: {
		visible: {
			immediate: true,
			handler(value) {
				const { vuiCascaderMenu, $el: element, $props: props } = this;
				const { $el: containter } = vuiCascaderMenu;

				if (!value) {
					return;
				}

				if (vuiCascaderMenu.state.mouseenter !== props.data[props.optionKeys.value]) {
					return;
				}

				if (!containter || !element) {
					return;
				}

				scrollIntoView(containter, element);
			}
		}
	},
	methods: {
		handleMouseenter(e) {
			const { $props: props } = this;
			const disabled = props.data[props.optionKeys.disabled];

			if (disabled) {
				return;
			}

			this.$emit("mouseenter", clone(props.data));
		},
		handleClick(e) {
			const { $props: props } = this;
			const disabled = props.data[props.optionKeys.disabled];

			if (disabled) {
				return;
			}

			this.$emit("click", clone(props.data));
		}
	},
	render(h) {
		const { vuiCascader, vuiCascaderMenu, $props: props } = this;
		const { handleMouseenter, handleClick } = this;

		// optionKeys
		const { label: labelKey, value: valueKey, children: childrenKey, disabled: disabledKey } = props.optionKeys;

		// value
		const value = props.data[valueKey];

		// status
		const hovered = vuiCascaderMenu.state.mouseenter === value;
		const selected = vuiCascaderMenu.state.click === value;
		const disabled = props.data[disabledKey];

		// classes
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "menu-item");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-hovered`]: hovered,
			[`${classNamePrefix}-selected`]: selected,
			[`${classNamePrefix}-disabled`]: disabled
		};
		classes.elLabel = `${classNamePrefix}-label`;
		classes.elIcon = `${classNamePrefix}-icon`;

		// render
		let children = [];

		if (props.dangerouslyUseHTMLString) {
			children.push(
				<div class={classes.elLabel} domPropsInnerHTML={props.data[labelKey]}></div>
			);
		}
		else {
			const scopedSlot = vuiCascader.$scopedSlots.option;
			let label;

			if (scopedSlot) {
				label = scopedSlot({
					option: clone(props.data),
					optionKeys: clone(props.optionKeys)
				});
			}
			else {
				label = props.data[labelKey];
			}

			children.push(
				<div class={classes.elLabel}>{label}</div>
			);
		}

		if (props.data[childrenKey]) {
			children.push(
				<VuiIcon type="chevron-right" class={classes.elIcon} />
			);
		}

		return (
			<div class={classes.el} onMouseenter={handleMouseenter} onClick={handleClick}>{children}</div>
		);
	}
};