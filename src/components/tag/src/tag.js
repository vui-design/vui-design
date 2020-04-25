import { hex2rgba, rgba2hex } from "vui-design/utils/color";

const VuiTag = {
	name: "vui-tag",

	props: {
		classNamePrefix: {
			type: String,
			default: "vui-tag"
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
		return {
			store: {
				checked: this.checked,
				colors: [
					"default", "primary", "info", "warning", "success", "error",
					"magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"
				]
			}
		};
	},

	computed: {
		withPresetColor() {
			return this.color && this.store.colors.indexOf(this.color) > -1;
		},
		withCustomColor() {
			return this.color && this.store.colors.indexOf(this.color) === -1;
		}
	},

	watch: {
		checked(value) {
			this.store.checked = value;
		}
	},

	methods: {
		handleChange() {
			if (!this.checkable) {
				return;
			}

			const checked = !this.store.checked;

			this.store.checked = checked;
			this.$emit("change", checked);
		},
		handleClose() {
			this.$emit("close");
		}
	},

	render() {
		let { $slots, classNamePrefix, closable, checkable, color, animation, store, withPresetColor, withCustomColor } = this;
		let { handleChange, handleClose } = this;
		let classes = {};
		let styles = {};
		let children = [];

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-closable`]: closable,
			[`${classNamePrefix}-checkable`]: checkable,
			[`${classNamePrefix}-checked`]: store.checked,
			[`${classNamePrefix}-${color}`]: withPresetColor
		};
		classes.btnClose = {
			[`${classNamePrefix}-btn-close`]: true
		};

		if (withCustomColor) {
			if (!checkable || (checkable && store.checked)) {
				let borderColor = hex2rgba(color, 0.45);
				let backgroundColor = hex2rgba(color, 0.05);

				styles.borderColor = rgba2hex(borderColor);
				styles.backgroundColor = rgba2hex(backgroundColor);
				styles.color = color;
			}
			else if (checkable && !store.checked) {
				styles.borderColor = "transparent";
				styles.backgroundColor = "transparent";
				styles.color = "#666";
			}
		}

		children.push($slots.default);

		if (closable) {
			children.push(
				<i domPropsInnerHTML="&#10005" class={classes.btnClose} onClick={handleClose}></i>
			);
		}

		return (
			<transition name={animation}>
				<label class={classes.el} style={styles} onClick={handleChange}>
					{children}
				</label>
			</transition>
		);
	}
};

export default VuiTag;
