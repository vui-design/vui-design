import Portal from "vui-design/directives/portal";
import Popup from "vui-design/utils/popup";
import PropTypes from "vui-design/utils/prop-types";
import is from "vui-design/utils/is";
import getStyle from "vui-design/utils/getStyle";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

export default {
	name: "vui-cascader-dropdown",
	inject: {
		vuiCascader: {
			default: undefined
		}
	},
	provide() {
		return {
			vuiCascaderDropdown: this
		};
	},
	directives: {
		Portal
	},
	props: {
		classNamePrefix: PropTypes.string,
		visible: PropTypes.bool.def(false),
		placement: PropTypes.oneOf(["top", "top-start", "top-end", "bottom", "bottom-start", "bottom-end"]).def("bottom-start"),
		autoWidth: PropTypes.bool.def(true),
		animation: PropTypes.string.def("vui-cascader-dropdown-scale"),
		getPopupReference: PropTypes.func,
		getPopupContainer: PropTypes.any.def(() => document.body)
	},
	computed: {
		searching() {
			return this.vuiCascader.state.searching;
		},
		keyword() {
			return this.vuiCascader.state.keyword;
		}
	},
	watch: {
		keyword(value) {
			this.$nextTick(() => this.reregister());
		}
	},
	methods: {
		register() {
			if (is.server || this.popup) {
				return;
			}

			const { $el: target, $props: props, searching } = this;
			const reference = props.getPopupReference();
			const settings = {
				placement: props.placement
			};

			if (!reference || !target || !settings.placement) {
				return;
			}

			this.popup = new Popup(reference, target, settings);
			this.popup.target.style.zIndex = Popup.nextZIndex();

			let key;
			let value;

			if (searching) {
				key = props.autoWidth ? "minWidth" : "width";
				value = getStyle(reference, "width");
			}
			else {
				key = props.autoWidth ? "minWidth" : "width";
				value = "unset";
			}

			this.popup.target.style[key] = value;
		},
		unregister() {
			if (is.server || !this.popup) {
				return;
			}

			this.popup.destroy();
			this.popup = null;
		},
		reregister() {
			if (is.server || !this.popup) {
				return;
			}

			this.popup.update();

			const { $props: props, searching } = this;
			const reference = props.getPopupReference();
			let key;
			let value;

			if (searching) {
				key = props.autoWidth ? "minWidth" : "width";
				value = getStyle(reference, "width");
			}
			else {
				key = props.autoWidth ? "minWidth" : "width";
				value = "unset";
			}

			this.popup.target.style[key] = value;
		},
		handleBeforeOpen() {
			this.$nextTick(() => this.register());
			this.$emit("beforeOpen");
		},
		handleAfterClose() {
			this.$nextTick(() => this.unregister());
			this.$emit("afterClose");
		},
		handleMousedown(e) {
			e.preventDefault();
		}
	},
	render(h) {
		const { $slots: slots, $props: props } = this;
		const { handleBeforeOpen, handleAfterClose, handleMousedown } = this;

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "dropdown");
		let classes = {};

		classes.el = `${classNamePrefix}`;

		// render
		return (
			<transition
				appear
				name={props.animation}
				onBeforeEnter={handleBeforeOpen}
				onAfterLeave={handleAfterClose}
			>
				<div
					v-portal={props.getPopupContainer}
					v-show={props.visible}
					class={classes.el}
					onMousedown={handleMousedown}
				>{slots.default}</div>
			</transition>
		);
	}
};