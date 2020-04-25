import VuiIcon from "vui-design/components/icon";
import guid from "vui-design/utils/guid";

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
		classNamePrefix: {
			type: String,
			default: "vui-panel"
		},
		name: {
			type: [String, Number],
			default: () => guid()
		},
		title: {
			type: [String, Number],
			default: undefined
		},
		extra: {
			type: [String, Number],
			default: undefined
		},
		arrowless: {
			type: Boolean,
			default: false
		},
		disabled: {
			type: Boolean,
			default: false
		},
		animation: {
			type: String,
			default: "vui-panel-collapse"
		}
	},

	methods: {
		handleToggle() {
			let { vuiCollapse, disabled } = this;

			if (disabled) {
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
		let { vuiCollapse, $slots, classNamePrefix, name, title, extra, arrowless, disabled, animation } = this;
		let { handleToggle, handleBeforeEnter, handleEnter, handleAfterEnter, handleBeforeLeave, handleLeave, handleAfterLeave } = this;

		let active;

		if (vuiCollapse.accordion) {
			active = name === vuiCollapse.currentValue;
		}
		else {
			active = vuiCollapse.currentValue.indexOf(name) > -1;
		}

		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-active`]: active,
			[`${classNamePrefix}-disabled`]: disabled
		};
		classes.header = `${classNamePrefix}-header`;
		classes.arrow = {
			[`${classNamePrefix}-arrow`]: true,
			[`${classNamePrefix}-arrow-${vuiCollapse.arrowAlign}`]: true
		};
		classes.title = `${classNamePrefix}-title`;
		classes.extra = `${classNamePrefix}-extra`;
		classes.bodyWrapper = `${classNamePrefix}-body-wrapper`;
		classes.body = `${classNamePrefix}-body`;

		return (
			<div class={classes.el}>
				<div class={classes.header} onClick={handleToggle}>
					{
						!arrowless && vuiCollapse.arrowAlign === "left" ? (
							<div class={classes.arrow}>
								<VuiIcon type="chevron-right" />
							</div>
						) : null
					}
					<div class={classes.title}>{$slots.title || title}</div>
					{
						$slots.extra || extra ? (
							<div class={classes.extra}>{$slots.extra || extra}</div>
						) : null
					}
					{
						!arrowless && vuiCollapse.arrowAlign === "right" ? (
							<div class={classes.arrow}>
								<VuiIcon type="chevron-right" />
							</div>
						) : null
					}
				</div>
				<transition
					name={animation}
					onBeforeEnter={handleBeforeEnter}
					onEnter={handleEnter}
					onAfterEnter={handleAfterEnter}
					onBeforeLeave={handleBeforeLeave}
					onLeave={handleLeave}
					onAfterLeave={handleAfterLeave}
				>
					<div v-show={active} class={classes.bodyWrapper}>
						<div class={classes.body}>{$slots.default}</div>
					</div>
				</transition>
			</div>
		);
	}
};

export default VuiPanel;