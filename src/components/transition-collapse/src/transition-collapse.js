const VuiTransitionCollapse = {
	name: "vui-transition-collapse",

	props: {
		animation: {
			type: String,
			default: "vui-transition-collapse"
		}
	},

	methods: {
		handleBeforeEnter(el) {
			// el.style.height = "0px";
		},
		handleEnter(el) {
			el.style.height = el.scrollHeight + "px";
		},
		handleAfterEnter(el) {
			el.style.height = "";
		},
		handleBeforeLeave(el) {
			el.style.height = el.scrollHeight + "px";
		},
		handleLeave(el) {
			// el.style.height = "0px";
		},
		handleAfterLeave(el) {
			el.style.height = "";
		}
	},

	render(h) {
		let { $slots: slots, $props: props } = this;
		let { handleBeforeEnter, handleEnter, handleAfterEnter, handleBeforeLeave, handleLeave, handleAfterLeave } = this;
		let attributes = {
			props: {
				name: props.animation
			},
			on: {
				beforeEnter: handleBeforeEnter,
				enter: handleEnter,
				afterEnter: handleAfterEnter,
				beforeLeave: handleBeforeLeave,
				leave: handleLeave,
				afterLeave: handleAfterLeave
			}
		};

		return (
			<transition {...attributes}>
				{slots.default}
			</transition>
		);
	}
};

export default VuiTransitionCollapse;