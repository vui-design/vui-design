import VuiIcon from "vui-design/components/icon";
import PropTypes from "vui-design/utils/prop-types";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const colors = [
	"default", "primary", "info", "warning", "success", "error",
	"blue", "cyan", "geekblue", "gold", "green", "lime", "magenta", "orange", "pink", "purple", "red", "volcano", "yellow"
];

const VuiTag = {
	name: "vui-tag",
	components: {
		VuiIcon
	},
	model: {
		prop: "checked",
		event: "input"
	},
	props: {
		classNamePrefix: PropTypes.string,
		size: PropTypes.oneOf(["small", "medium", "large"]).def("medium"),
		color: PropTypes.string.def("default"),
		icon: PropTypes.string,
		closable: PropTypes.bool.def(false),
		checkable: PropTypes.bool.def(false),
		checked: PropTypes.bool.def(false),
		animation: PropTypes.string.def("vui-tag-zoom")
	},
	data() {
		const { $props: props } = this;
		const state = {
			checked: props.checked
		};

		return {
			state
		};
	},
	watch: {
		checked(value) {
			this.state.checked = value;
		}
	},
	methods: {
		handleClick(e) {
			this.$emit("click", e);
			this.handleChange(e);
		},
		handleClose(e) {
			e.stopPropagation();
			this.$emit("close", e);
		},
		handleChange(e) {
			const { $props: props, state } = this;

			if (!props.checkable) {
				return;
			}

			const checked = !state.checked;

			this.state.checked = checked;
			this.$emit("input", checked);
			this.$emit("change", checked);
		}
	},
	render() {
		const { $slots: slots, $props: props, state } = this;
		const { handleClick, handleClose } = this;

		// color
		const withPresetColor = props.color && colors.indexOf(props.color) > -1;
		const withCustomColor = props.color && colors.indexOf(props.color) === -1;

		// icon
		let icon;

		if (slots.icon) {
			icon = slots.icon;
		}
		else if (props.icon) {
			icon = (
				<VuiIcon type={props.icon} />
			);
		}

		// status
		let status;

		if (props.checkable) {
			status = state.checked ? "checked" : "unchecked";
		}

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "tag");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.size}`]: props.size,
			[`${classNamePrefix}-${props.color}`]: withPresetColor,
			[`${classNamePrefix}-${status}`]: props.checkable
		};
		classes.elIcon = `${classNamePrefix}-icon`;
		classes.elBtnClose = `${classNamePrefix}-btn-close`;

		// style
		let styles = {};

		if (withCustomColor && (!props.checkable || state.checked)) {
			styles.el = {
				borderColor: props.color,
				backgroundColor: props.color,
				color: "#fff"
			};
		}

		// render
		let children = [];

		if (icon) {
			children.push(
				<div class={classes.elIcon}>{icon}</div>
			);
		}

		children.push(
			<label>{slots.default}</label>
		);

		if (props.closable) {
			children.push(
				<div class={classes.elBtnClose} onClick={handleClose}>
					<VuiIcon type="crossmark" />
				</div>
			);
		}

		return (
			<transition name={props.animation}>
				<div class={classes.el} style={styles.el} onClick={handleClick}>{children}</div>
			</transition>
		);
	}
};

export default VuiTag;