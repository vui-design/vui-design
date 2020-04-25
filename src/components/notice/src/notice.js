import VuiIcon from "vui-design/components/icon";
import Portal from "vui-design/directives/portal";
import is from "vui-design/utils/is";
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
			default: "vui-notice"
		},
		type: {
			type: String,
			default: "info",
			validator(value) {
				return ["info", "warning", "success", "error"].indexOf(value) > -1;
			}
		},
		title: {
			type: [String, Object, Function],
			default: undefined
		},
		description: {
			type: [String, Object, Function],
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
			validator(value) {
				return ["top-left", "top-right", "bottom-left", "bottom-right"].indexOf(value) > -1;
			}
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
		return {
			defaultVisible: this.visible,
			zIndex: Popup.nextZIndex()
		};
	},

	watch: {
		visible(value) {
			if (this.defaultVisible === value) {
				return;
			}

			this.defaultVisible = value;
		},
		defaultVisible(value) {
			if (!value) {
				return;
			}

			this.zIndex = Popup.nextZIndex();
		}
	},

	methods: {
		open() {
			this.defaultVisible = true;
			this.$emit("change", this.defaultVisible);
		},
		close() {
			this.defaultVisible = false;
			this.$emit("change", this.defaultVisible);
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
		let { $slots, classNamePrefix, type, closable, closeText, placement, zIndex, top, bottom, defaultVisible, animation, getPopupContainer } = this;
		let { handleBtnCloseClick, handleEnter, handleAfterEnter, handleLeave, handleAfterLeave } = this;
		let portal = getPopupContainer();

		// title
		let title;

		if ($slots.default) {
			title = $slots.default;
		}
		else if (this.title) {
			title = is.function(this.title) ? this.title(h) : this.title;
		}

		// description
		let description;

		if ($slots.description) {
			description = $slots.description;
		}
		else if (this.description) {
			description = is.function(this.description) ? this.description(h) : this.description;
		}

		// icon
		let icon;

		if ($slots.icon) {
			icon = $slots.icon;
		}
		else if (this.icon) {
			icon = (
				<VuiIcon type={this.icon} />
			);
		}

		// btnClose
		let btnClose;

		if (closable) {
			if (closeText) {
				btnClose = closeText;
			}
			else {
				btnClose = (
					<VuiIcon type="crossmark" />
				);
			}
		}

		// classes
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${type}`]: type,
			[`${classNamePrefix}-with-description`]: description,
			[`${classNamePrefix}-with-icon`]: icon,
			[`${classNamePrefix}-closable`]: closable,
			[`${classNamePrefix}-${placement}`]: placement
		};
		classes.title = `${classNamePrefix}-title`;
		classes.description = `${classNamePrefix}-description`;
		classes.icon = `${classNamePrefix}-icon`;
		classes.btnClose = `${classNamePrefix}-btn-close`;

		// styles
		let styles = {};

		styles.el = {
			zIndex
		};

		if (/^(top)(-left|-right)?$/g.test(placement)) {
			styles.el.top = `${top}px`;
		}
		else if (/^(bottom)(-left|-right)?$/g.test(placement)) {
			styles.el.bottom = `${bottom}px`;
		}

		// render
		let children = [];

		if (title) {
			children.push(
				<div class={classes.title}>{title}</div>
			);
		}

		if (description) {
			children.push(
				<div class={classes.description}>{description}</div>
			);
		}

		if (icon) {
			children.push(
				<div class={classes.icon}>{icon}</div>
			);
		}

		if (closable) {
			children.push(
				<div class={classes.btnClose} onClick={handleBtnCloseClick}>{btnClose}</div>
			);
		}

		return (
			<transition
				name={animation}
				onEnter={handleEnter}
				onAfterEnter={handleAfterEnter}
				onLeave={handleLeave}
				onAfterLeave={handleAfterLeave}
				appear
			>
				<div v-portal={portal} v-show={defaultVisible} class={classes.el} style={styles.el}>
					{children}
				</div>
			</transition>
		);
	}
};

export default VuiNotice;