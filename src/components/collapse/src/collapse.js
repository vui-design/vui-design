import PropTypes from "../../../utils/prop-types";
import is from "../../../utils/is";
import clone from "../../../utils/clone";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiCollapse = {
	name: "vui-collapse",
	provide() {
		return {
			vuiCollapse: this
		};
	},
	model: {
		prop: "value",
		event: "input"
	},
	props: {
		classNamePrefix: PropTypes.string,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
		accordion: PropTypes.bool.def(false),
		bordered: PropTypes.bool.def(true),
		arrowAlign: PropTypes.oneOf(["left", "right"]).def("left"),
		destroyInactivePanel: PropTypes.bool.def(false)
	},
	data() {
		const { $props: props } = this;
		const state = {};

		if (props.accordion) {
			state.value = is.array(props.value) ? undefined : props.value;
		}
		else {
			state.value = is.array(props.value) ? props.value : [];
		}

		return {
			state
		};
	},
	watch: {
		value(value) {
			const { $props: props } = this;

			if (props.accordion) {
				this.state.value = is.array(value) ? undefined : value;
			}
			else {
				this.state.value = is.array(value) ? value : [];
			}
		}
	},
	methods: {
		handleToggle(panel) {
			const { $props: props } = this;
			const value = panel.value;

			if (props.accordion) {
				if (this.state.value === value) {
					this.state.value = undefined;
				}
				else {
					this.state.value = value;
				}
			}
			else {
				const index = this.state.value.indexOf(value);

				if (index === -1) {
					this.state.value.push(value);
				}
				else {
					this.state.value.splice(index, 1);
				}
			}

			this.$emit("input", clone(this.state.value));
			this.$emit("change", clone(this.state.value));
		}
	},
	render(h) {
		const { $slots: slots, $props: props } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "collapse");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-bordered`]: props.bordered
		};

		// render
		return (
			<div class={classes.el}>{slots.default}</div>
		);
	}
};

export default VuiCollapse;