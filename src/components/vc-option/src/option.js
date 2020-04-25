import VuiIcon from "vui-design/components/icon";
import scrollIntoView from "vui-design/utils/scrollIntoView";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VcOption = {
	name: "vui-option",

	inject: {
		vcSelect: {
			default: undefined
		},
		vcOptionGroup: {
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
		label: {
			type: [String, Number],
			default: undefined
		},
		value: {
			type: [String, Number],
			default: undefined,
			required: true
		},
		hovered: {
			type: Boolean,
			default: false
		},
		selected: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		}
	},

	watch: {
		hovered(value) {
			if (!value) {
				return;
			}

			const view = this.vcSelect.$refs.dropdown.$el;
			const target = this.$el;

			if (!view || !target) {
				return;
			}

			scrollIntoView(view, target);
		}
	},

	methods: {
		handleMouseenter(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("mouseenter", this.value);
		},
		handleClick(e) {
			if (this.disabled) {
				return;
			}

			this.$emit("click", this.value);
		}
	},

	render() {
		let { vcSelect, $slots: slots, classNamePrefix: customizedClassNamePrefix, label, value, hovered, selected, disabled } = this;
		let { handleMouseenter, handleClick } = this;
		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "option");
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-hovered`]: hovered,
			[`${classNamePrefix}-selected`]: selected,
			[`${classNamePrefix}-disabled`]: disabled
		};

		return (
			<div
				class={classes}
				onMouseenter={handleMouseenter}
				onClick={handleClick}
			>
				{slots.default || label || value}
				{vcSelect.multiple && selected && <VuiIcon type="checkmark" />}
			</div>
		);
	}
};

export default VcOption;