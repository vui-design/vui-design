import VuiIcon from "vui-design/components/icon";
import Portal from "vui-design/directives/portal";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
import Popup from "vui-design/utils/popup";

const VuiNotice = {
	name: "vui-notice",

	components: {
		VuiIcon
	},

	directives: {
		Portal
	},

	model: {
		prop: "visible",
		event: "change"
	},

	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		type: {
			type: String,
			default: "info",
			validator: value => ["info", "warning", "success", "error"].indexOf(value) > -1
		},
		title: {
			type: [String, Function, Object],
			default: undefined
		},
		description: {
			type: [String, Function, Object],
			default: undefined
		},
		icon: {
			type: String,
			default: undefined
		},
		closable: {
			type: Boolean,
			default: true
		},
		closeText: {
			type: String,
			default: undefined
		},
		placement: {
			type: String,
			default: "top-right",
			validator: value => ["top-left", "top-right", "bottom-left", "bottom-right"].indexOf(value) > -1
		},
		top: {
			type: Number,
			default: 20
		},
		bottom: {
			type: Number,
			default: 20
		},
		visible: {
			type: Boolean,
			default: false
		},
		animation: {
			type: String,
			default: "vui-notice-fade"
		},
		getPopupContainer: {
			type: Function,
			default: () => document.body
		}
	},

	data() {
		let { $props: props } = this;

		return {
			state: {
				visible: props.visible,
				zIndex: Popup.nextZIndex(),
				cancelLoading: false,
				okLoading: false
			}
		};
	},

	computed: {
		visibility() {
			return this.state.visible;
		}
	},

	watch: {
		visible(value) {
			if (this.state.visible === value) {
				return;
			}

			this.state.visible = value;
		},
		visibility(value) {
			if (!value) {
				return;
			}

			this.state.zIndex = Popup.nextZIndex();
		}
	},

	methods: {
		open() {
			this.state.visible = true;
			this.$emit("change", true);
		},
		close() {
			this.state.visible = false;
			this.$emit("change", false);
		},
		handleBtnCloseClick() {
			this.close();
		},
		handleEnter() {
			this.$emit("open");
		},
		handleAfterEnter() {
			this.$emit("afterOpen");
		},
		handleLeave() {
			this.$emit("close");
		},
		handleAfterLeave() {
			this.$emit("afterClose");
		}
	},

	render(h) {
		let { $slots: slots, $props: props, state } = this;
		let { handleBtnCloseClick, handleEnter, handleAfterEnter, handleLeave, handleAfterLeave } = this;
		let portal = props.getPopupContainer();

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

		// title
		let title;

		if (slots.default) {
			title = slots.default;
		}
		else if (props.title) {
			title = is.function(props.title) ? props.title(h) : props.title;
		}

		// description
		let description;

		if (slots.description) {
			description = slots.description;
		}
		else if (props.description) {
			description = is.function(props.description) ? props.description(h) : props.description;
		}

		// btnClose
		let btnClose;

		if (props.closable) {
			if (props.closeText) {
				btnClose = props.closeText;
			}
			else {
				btnClose = (
					<VuiIcon type="crossmark" />
				);
			}
		}

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "notice");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${props.type}`]: props.type,
			[`${classNamePrefix}-with-icon`]: icon,
			[`${classNamePrefix}-with-description`]: description,
			[`${classNamePrefix}-closable`]: props.closable,
			[`${classNamePrefix}-${props.placement}`]: props.placement
		};
		classes.elIcon = `${classNamePrefix}-icon`;
		classes.elTitle = `${classNamePrefix}-title`;
		classes.elDescription = `${classNamePrefix}-description`;
		classes.elBtnClose = `${classNamePrefix}-btn-close`;

		// style
		let styles = {};

		styles.el = {
			zIndex: state.zIndex
		};

		if (/^(top)(-left|-right)?$/g.test(props.placement)) {
			styles.el.top = `${props.top}px`;
		}
		else if (/^(bottom)(-left|-right)?$/g.test(props.placement)) {
			styles.el.bottom = `${props.bottom}px`;
		}

		// render
		let children = [];

		if (icon) {
			children.push(
				<div class={classes.elIcon}>{icon}</div>
			);
		}

		if (title) {
			children.push(
				<div class={classes.elTitle}>{title}</div>
			);
		}

		if (description) {
			children.push(
				<div class={classes.elDescription}>{description}</div>
			);
		}

		if (props.closable) {
			children.push(
				<div class={classes.elBtnClose} onClick={handleBtnCloseClick}>{btnClose}</div>
			);
		}

		return (
			<transition name={props.animation} onEnter={handleEnter} onAfterEnter={handleAfterEnter} onLeave={handleLeave} onAfterLeave={handleAfterLeave} appear>
				<div v-portal={portal} v-show={state.visible} class={classes.el} style={styles.el}>
					{children}
				</div>
			</transition>
		);
	}
};

export default VuiNotice;