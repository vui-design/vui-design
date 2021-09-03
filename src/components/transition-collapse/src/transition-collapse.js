import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiTransitionCollapse = {
	name: "vui-transition-collapse",
	props: {
		classNamePrefix: PropTypes.string,
		visible: PropTypes.bool.def(false),
		animation: PropTypes.string.def("vui-transition-collapse")
	},
	methods: {
		handleBeforeEnter(el) {
			el.style.height = "0px";
		},
		handleEnter(el) {
			el.style.height = el.scrollHeight + "px";
			// 重复一次才能正确设置 height 高度，why？
			el.style.height = el.scrollHeight + "px";
		},
		handleAfterEnter(el) {
			el.style.height = "";
		},
		handleBeforeLeave(el) {
			el.style.height = el.scrollHeight + "px";
			// 重复一次才能正确设置 height 高度，why？
			el.style.height = el.scrollHeight + "px";
		},
		handleLeave(el) {
			el.style.height = "0px";
		},
		handleAfterLeave(el) {
			el.style.height = "";
		}
	},
	render(h) {
		const { $slots: slots, $props: props } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "transition-collapse");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true
		};

		// transition attributes
		const attributes = {
			props: {
				name: props.animation
			},
			on: {
				beforeEnter: this.handleBeforeEnter,
				enter: this.handleEnter,
				afterEnter: this.handleAfterEnter,
				beforeLeave: this.handleBeforeLeave,
				leave: this.handleLeave,
				afterLeave: this.handleAfterLeave
			}
		};

		return (
			<transition {...attributes}>
				<div v-show={props.visible} class={classes.el}>{slots.default}</div>
			</transition>
		);
	}
};

export default VuiTransitionCollapse;