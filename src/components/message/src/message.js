import VuiIcon from "vui-design/components/icon";
import Portal from "vui-design/directives/portal";
import is from "vui-design/utils/is";
import Popup from "vui-design/utils/popup";

const VuiMessage = {
	name: "vui-message",

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
			default: "vui-message"
		},
		type: {
			type: String,
			default: "info",
			validator(value) {
				return ["info", "warning", "success", "error", "loading"].indexOf(value) > -1;
			}
		},
		content: {
			type: [String, Function],
			default: undefined
		},
		icon: {
			type: String,
			default: undefined
		},
		closable: {
			type: Boolean,
			default: false
		},
		closeText: {
			type: String,
			default: undefined
		},
		top: {
			type: [String, Number],
			default: "20px"
		},
		visible: {
			type: Boolean,
			default: false
		},
		animation: {
			type: String,
			default: "vui-message-fade"
		},
		getPopupContainer: {
			type: Function,
			default: () => document.body
		}
	},

	data() {
		return {
			defaultVisible: this.visible,
			zIndex: 0
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
			this.$emit("change", true);
		},
		close() {
			this.defaultVisible = false;
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

	render() {
		let { $slots, classNamePrefix, type, closable, closeText, zIndex, top, defaultVisible, animation, getPopupContainer } = this;
		let { handleBtnCloseClick, handleEnter, handleAfterEnter, handleLeave, handleAfterLeave } = this;
		let portal = getPopupContainer();

		// content
		let content;

		if ($slots.default) {
			content = $slots.default;
		}
		else if (this.content) {
			content = is.function(this.content) ? this.content(h) : this.content;
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
			[`${classNamePrefix}-with-icon`]: icon,
			[`${classNamePrefix}-closable`]: closable
		};
		classes.content = `${classNamePrefix}-content`;
		classes.icon = `${classNamePrefix}-icon`;
		classes.btnClose = `${classNamePrefix}-btn-close`;

		// styles
		let styles = {};

		styles.el = {
			zIndex,
			top: is.string(top) ? top : `${top}px`
		};

		// render
		let children = [];

		children.push(
			<div class={classes.content}>
				{content}
			</div>
		);

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

export default VuiMessage;
