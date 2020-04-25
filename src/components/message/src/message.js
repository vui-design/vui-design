import VuiIcon from "vui-design/components/icon";
import Portal from "vui-design/directives/portal";
import is from "vui-design/utils/is";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";
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
			default: undefined
		},
		type: {
			type: String,
			default: "info",
			validator(value) {
				return ["info", "warning", "success", "error", "loading"].indexOf(value) > -1;
			}
		},
		content: {
			type: [String, Object, Function],
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
			default: 20
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
		let { $slots: slots, classNamePrefix: customizedClassNamePrefix, type, closable, closeText, top, zIndex, defaultVisible, animation, getPopupContainer } = this;
		let { handleBtnCloseClick, handleEnter, handleAfterEnter, handleLeave, handleAfterLeave } = this;
		let portal = getPopupContainer();

		let content;

		if (slots.default) {
			content = slots.default;
		}
		else if (this.content) {
			content = is.function(this.content) ? this.content(h) : this.content;
		}

		let icon;

		if (slots.icon) {
			icon = slots.icon;
		}
		else if (this.icon) {
			icon = (
				<VuiIcon type={this.icon} />
			);
		}

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

		let classNamePrefix = getClassNamePrefix(customizedClassNamePrefix, "message");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-${type}`]: type,
			[`${classNamePrefix}-with-icon`]: icon,
			[`${classNamePrefix}-closable`]: closable
		};
		classes.elContent = `${classNamePrefix}-content`;
		classes.elIcon = `${classNamePrefix}-icon`;
		classes.elBtnClose = `${classNamePrefix}-btn-close`;

		let styles = {};

		styles.el = {
			top: `${top}px`,
			zIndex
		};

		let children = [];

		children.push(
			<div class={classes.elContent}>{content}</div>
		);

		if (icon) {
			children.push(
				<div class={classes.elIcon}>{icon}</div>
			);
		}

		if (closable) {
			children.push(
				<div class={classes.elBtnClose} onClick={handleBtnCloseClick}>{btnClose}</div>
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
