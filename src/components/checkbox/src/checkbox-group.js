import VuiCheckbox from "vui-design/components/checkbox";
import Emitter from "vui-design/mixins/emitter";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import guid from "vui-design/utils/guid";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiCheckboxGroup = {
	name: "vui-checkbox-group",
	inject: {
		vuiForm: {
			default: undefined
		}
	},
	provide() {
		return {
			vuiCheckboxGroup: this
		};
	},
	components: {
		VuiCheckbox
	},
	mixins: [
		Emitter
	],
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		classNamePrefix: PropTypes.string,
		type: PropTypes.string,
		size: PropTypes.oneOf(["small", "medium", "large"]),
		vertical: PropTypes.bool.def(false),
		name: PropTypes.string.def(() => guid()),
		options: PropTypes.array.def(() => []),
		value: PropTypes.array.def(() => []),
		disabled: PropTypes.bool.def(false)
	},
	data() {
		const { $props: props } = this;

		return {
			state: {
				value: props.value
			}
		};
	},
	watch: {
		value(value) {
			if (this.state.value === value) {
				return;
			}

			this.state.value = value;
			this.dispatch("vui-form-item", "change", value);
		}
	},
	methods: {
		handleChange(data) {
			let value = [...this.state.value];

			if (data.checked) {
				value.push(data.value);
			}
			else {
				const index = value.indexOf(data.value);

				value.splice(index, 1);
			}

			this.state.value = value;
			this.$emit("input", value);
			this.$emit('change', value);
			this.dispatch("vui-form-item", "change", value);
		}
	},
	render() {
		const { $slots: slots, $props: props, state } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "checkbox-group");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-vertical`]: props.vertical
		};

		// render
		let children;

		if (props.options && props.options.length > 0) {
			children = props.options.map(option => {
				if (is.object(option)) {
					return (
						<VuiCheckbox key={option.value} value={option.value} disabled={option.disabled}>{option.label}</VuiCheckbox>
					);
				}
				else if (is.string(option) || is.number(option)) {
					return (
						<VuiCheckbox key={option} value={option}>{option}</VuiCheckbox>
					);
				}
			});
		}
		else {
			children = slots.default;
		}

		return (
			<div class={classes.el}>{children}</div>
		);
	}
};

export default VuiCheckboxGroup;