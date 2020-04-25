import VuiIcon from "vui-design/components/icon";
import MixinLink from "vui-design/mixins/link";
import is from "vui-design/utils/is";

const VuiButton = {
	name: "vui-button",

	inject: {
		vuiForm: {
			default: undefined
		},
		vuiInputGroup: {
			default: undefined
		},
		vuiButtonGroup: {
			default: undefined
		}
	},

	components: {
		VuiIcon
	},

	mixins: [
		MixinLink
	],

	inheritAttrs: false,

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-button"
		},
		type: {
			type: String,
			default: "default",
			validator(value) {
				return ["default", "primary", "info", "warning", "success", "error", "dashed", "text"].indexOf(value) > -1;
			}
		},
		icon: {
			type: String,
			default: undefined
		},
		shape: {
			type: String,
			default: undefined,
			validator(value) {
				return ["round", "circle"].indexOf(value) > -1;
			}
		},
		size: {
			type: String,
			default: undefined,
			validator(value) {
				return ["small", "medium", "large"].indexOf(value) > -1;
			}
		},
		loading: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		htmlType: {
			type: String,
			default: "button",
			validator(value) {
				return ["button", "submit", "reset"].indexOf(value) > -1;
			}
		}
	},

	methods: {
		insertTextIntoSpan(child) {
			if (is.string(child.text)) {
				return (
					<span>{child.text.trim()}</span>
				);
			}
			else {
				return child;
			}
		},
		handleButtonClick(e) {
			this.$emit("click", e);
		}
	},

	render() {
		let { $vui, vuiForm, vuiInputGroup, vuiButtonGroup, $slots, $attrs, $listeners, classNamePrefix, icon, loading, htmlType, href, to, target } = this;
		let { insertTextIntoSpan, getNextRoute } = this;
		let { handleButtonClick, handleLinkClick } = this;

		// 属性 type 优先级：vuiButtonGroup > self
		let type;

		if (vuiButtonGroup) {
			type = vuiButtonGroup.type;
		}
		else {
			type = this.type;
		}

		// 属性 shape 优先级：vuiButtonGroup > self
		let shape;

		if (vuiButtonGroup) {
			shape = vuiButtonGroup.shape;
		}
		else {
			shape = this.shape;
		}

		// 属性 size 优先级：self > vuiButtonGroup > vuiInputGroup > vuiForm > $vui
		let size;

		if (this.size) {
			size = this.size;
		}
		else if (vuiButtonGroup && vuiButtonGroup.size) {
			size = vuiButtonGroup.size;
		}
		else if (vuiInputGroup && vuiInputGroup.size) {
			size = vuiInputGroup.size;
		}
		else if (vuiForm && vuiForm.size) {
			size = vuiForm.size;
		}
		else if ($vui && $vui.size) {
			size = $vui.size;
		}
		else {
			size = "medium";
		}

		// 属性 disabled 优先级：vuiForm > vuiInputGroup > vuiButtonGroup > self
		let disabled;

		if (vuiForm && vuiForm.disabled) {
			disabled = vuiForm.disabled;
		}
		else if (vuiInputGroup && vuiInputGroup.disabled) {
			disabled = vuiInputGroup.disabled;
		}
		else if (vuiButtonGroup && vuiButtonGroup.disabled) {
			disabled = vuiButtonGroup.disabled;
		}
		else {
			disabled = this.disabled;
		}

		// classes
		let classes = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${type}`]: type,
			[`${classNamePrefix}-${shape}`]: shape,
			[`${classNamePrefix}-${size}`]: size,
			[`${classNamePrefix}-loading`]: loading,
			[`${classNamePrefix}-disabled`]: disabled
		};

		// render
		let children = [];

		if (loading) {
			children.push(
				<vui-icon type="loading" />
			);
		}
		else if (icon) {
			children.push(
				<vui-icon type={icon} />
			);
		}

		if ($slots.default) {
			$slots.default.forEach(child => {
				children.push(insertTextIntoSpan(child));
			});
		}

		let props = {
			attrs: {
				...$attrs,
				disabled
			},
			class: classes,
			on: {
				...$listeners
			}
		};

		if (!href && !to) {
			props.attrs.type = htmlType;
			props.on.click = handleButtonClick;

			return (
				<button {...props}>
					{children}
				</button>
			);
		}
		else {
			if (href) {
				props.attrs.href = href;
			}
			else {
				let next = getNextRoute();

				props.attrs.href = next.href;
			}

			props.attrs.target = target;
			props.on.click = handleLinkClick;

			return (
				<a {...props}>
					{children}
				</a>
			);
		}
	}
};

export default VuiButton;