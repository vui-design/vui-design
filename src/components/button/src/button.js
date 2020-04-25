import VuiIcon from "vui-design/components/icon";
import Link from "vui-design/mixins/link";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

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
		Link
	],

	inheritAttrs: false,

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		type: {
			type: String,
			default: "default",
			validator: value => ["default", "primary", "info", "warning", "success", "error", "dashed", "text"].indexOf(value) > -1
		},
		icon: {
			type: String,
			default: undefined
		},
		shape: {
			type: String,
			default: undefined,
			validator: value => ["round", "circle"].indexOf(value) > -1
		},
		size: {
			type: String,
			default: undefined,
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
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
			validator: value => ["button", "submit", "reset"].indexOf(value) > -1
		}
	},

	methods: {
		insertTextIntoSpan(element) {
			if (is.string(element.text)) {
				return (
					<span>{element.text.trim()}</span>
				);
			}
			else {
				return element;
			}
		},
		handleButtonClick(e) {
			this.$emit("click", e);
		}
	},

	render() {
		let { $vui: vui, vuiForm, vuiInputGroup, vuiButtonGroup } = this;
		let { $slots: slots, $props: props, $attrs: attrs, $listeners: listeners } = this;
		let { insertTextIntoSpan, getNextRoute, handleButtonClick, handleLinkClick } = this;

		// type: vuiButtonGroup > self
		let type;

		if (vuiButtonGroup) {
			type = vuiButtonGroup.type;
		}
		else {
			type = props.type;
		}

		// shape: vuiButtonGroup > self
		let shape;

		if (vuiButtonGroup) {
			shape = vuiButtonGroup.shape;
		}
		else {
			shape = props.shape;
		}

		// size: self > vuiButtonGroup > vuiInputGroup > vuiForm > vui
		let size;

		if (props.size) {
			size = props.size;
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
		else if (vui && vui.size) {
			size = vui.size;
		}
		else {
			size = "medium";
		}

		// disabled: vuiForm > vuiInputGroup > vuiButtonGroup > self
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
			disabled = props.disabled;
		}

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "button");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${type}`]: type,
			[`${classNamePrefix}-${shape}`]: shape,
			[`${classNamePrefix}-${size}`]: size,
			[`${classNamePrefix}-loading`]: props.loading,
			[`${classNamePrefix}-disabled`]: disabled
		};

		// render
		let children = [];

		if (props.loading) {
			children.push(
				<VuiIcon type="loading" />
			);
		}
		else if (props.icon) {
			children.push(
				<VuiIcon type={props.icon} />
			);
		}

		if (slots.default) {
			slots.default.forEach(element => children.push(insertTextIntoSpan(element)));
		}

		let attributes = {
			attrs: {
				...attrs,
				disabled
			},
			class: classes.el,
			on: {
				...listeners
			}
		};

		if (props.href || props.to) {
			if (props.href) {
				attributes.attrs.href = props.href;
			}
			else {
				let route = getNextRoute();

				attributes.attrs.href = route.href;
			}

			attributes.attrs.target = props.target;
			attributes.on.click = handleLinkClick;

			return (
				<a {...attributes}>{children}</a>
			);
		}
		else {
			attributes.attrs.type = props.htmlType;
			attributes.on.click = handleButtonClick;

			return (
				<button {...attributes}>{children}</button>
			);
		}
	}
};

export default VuiButton;