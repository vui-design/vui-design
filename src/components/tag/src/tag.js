import { hex2rgba, rgba2hex } from "vui-design/utils/color";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiTag = {
	name: "vui-tag",

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		size: {
			type: String,
			default: "medium",
			validator: value => ["small", "medium", "large"].indexOf(value) > -1
		},
		closable: {
			type: Boolean,
			default: false
		},
		checkable: {
			type: Boolean,
			default: false
		},
		checked: {
			type: Boolean,
			default: false
		},
		color: {
			type: String,
			default: "default"
		},
		animation: {
			type: String,
			default: "vui-tag-zoom"
		}
	},

	data() {
		let colors = [
			"default", "primary", "info", "warning", "success", "error",
			"magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"
		];

		return {
			state: {
				checked: this.checked,
				colors
			}
		};
	},

	watch: {
		checked(value) {
			this.state.checked = value;
		}
	},

	methods: {
		handleChange(e) {
			this.$emit("click", e);

			let { $props: props, state } = this;

			if (!props.checkable) {
				return;
			}

			let checked = !state.checked;

			this.state.checked = checked;
			this.$emit("change", checked);
		},
		handleClose(e) {
			this.$emit("close", e);
		}
	},

	render() {
		let { $slots: slots, $props: props, state } = this;
		let { handleChange, handleClose } = this;

		// withPresetColor
		let withPresetColor = props.color && state.colors.indexOf(props.color) > -1;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "tag");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.size}`]: props.size,
			[`${classNamePrefix}-closable`]: props.closable,
			[`${classNamePrefix}-checkable`]: props.checkable,
			[`${classNamePrefix}-checked`]: state.checked,
			[`${classNamePrefix}-${props.color}`]: withPresetColor
		};
		classes.elBtnClose = `${classNamePrefix}-btn-close`;

		// style
		let styles = {};

		if (!withPresetColor) {
			if (!props.checkable || (props.checkable && state.checked)) {
				let borderColor = hex2rgba(props.color, 0.45);
				let backgroundColor = hex2rgba(props.color, 0.05);

				styles.el = {
					borderColor: rgba2hex(borderColor),
					backgroundColor: rgba2hex(backgroundColor),
					color: props.color
				};
			}
			else if (props.checkable && !state.checked) {
				styles.el = {
					borderColor: "transparent",
					backgroundColor: "transparent",
					color: rgba2hex(hex2rgba("#000", 0.65))
				};
			}
		}

		// render
		let children = [];

		children.push(slots.default);

		if (props.closable) {
			children.push(
				<i domPropsInnerHTML="&#10005" class={classes.elBtnClose} onClick={handleClose} />
			);
		}

		return (
			<transition name={props.animation}>
				<label class={classes.el} style={styles.el} onClick={handleChange}>
					{children}
				</label>
			</transition>
		);
	}
};

export default VuiTag;
