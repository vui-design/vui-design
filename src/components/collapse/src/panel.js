import VuiIcon from "vui-design/components/icon";
import PropTypes from "vui-design/utils/prop-types";
import guid from "vui-design/utils/guid";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

const VuiPanel = {
	name: "vui-panel",
	inject: {
		vuiCollapse: {
			default: undefined
		}
	},
	components: {
		VuiIcon
	},
	props: {
		classNamePrefix: PropTypes.string,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).def(() => guid()),
		title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		extra: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		showArrow: PropTypes.bool.def(true),
		disabled: PropTypes.bool.def(false),
		animation: PropTypes.string.def("vui-collapse-panel-collapse"),
	},
	methods: {
		handleToggle() {
			const { vuiCollapse, $props: props } = this;

			if (props.disabled) {
				return;
			}

			if (!vuiCollapse) {
				return;
			}

			vuiCollapse.handleToggle(this);
		},
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
		const { vuiCollapse, $slots: slots, $props: props } = this;
		const { $props: vuiCollapseProps, state: vuiCollapseState } = vuiCollapse;
		const { handleToggle, handleBeforeEnter, handleEnter, handleAfterEnter, handleBeforeLeave, handleLeave, handleAfterLeave } = this;

		// active
		let active;

		if (vuiCollapseProps.accordion) {
			active = props.value === vuiCollapseState.value;
		}
		else {
			active = vuiCollapseState.value.indexOf(props.value) > -1;
		}

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "collapse-panel");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-active`]: active,
			[`${classNamePrefix}-disabled`]: props.disabled
		};
		classes.elHeader = `${classNamePrefix}-header`;
		classes.elArrow = {
			[`${classNamePrefix}-arrow`]: true,
			[`${classNamePrefix}-arrow-${vuiCollapseProps.arrowAlign}`]: true
		};
		classes.elTitle = `${classNamePrefix}-title`;
		classes.elExtra = `${classNamePrefix}-extra`;
		classes.elBodyWrapper = `${classNamePrefix}-body-wrapper`;
		classes.elBody = `${classNamePrefix}-body`;

		// render
		let header = [];

		header.push(
			<div class={classes.elTitle}>{slots.title || props.title}</div>
		);

		if (slots.extra || props.extra) {
			header.push(
				<div class={classes.elExtra}>{slots.extra || props.extra}</div>
			);
		}

		if (props.showArrow) {
			const arrow = (
				<div class={classes.elArrow}>
					<VuiIcon type="chevron-right" />
				</div>
			);

			if (vuiCollapseProps.arrowAlign === "left") {
				header.unshift(arrow);
			}
			else if (vuiCollapseProps.arrowAlign === "right") {
				header.push(arrow);
			}
		}

		const body = slots.default;

		return (
			<div class={classes.el}>
				<div class={classes.elHeader} onClick={handleToggle}>{header}</div>
				<transition
					name={props.animation}
					onBeforeEnter={handleBeforeEnter}
					onEnter={handleEnter}
					onAfterEnter={handleAfterEnter}
					onBeforeLeave={handleBeforeLeave}
					onLeave={handleLeave}
					onAfterLeave={handleAfterLeave}
				>
					<div v-show={active} class={classes.elBodyWrapper}>
						<div class={classes.elBody}>{body}</div>
					</div>
				</transition>
			</div>
		);
	}
};

export default VuiPanel;