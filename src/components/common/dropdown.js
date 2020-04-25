import Portal from "vui-design/directives/portal";
import Popup from "vui-design/utils/popup";
import is from "vui-design/utils/is";
import getStyle from "vui-design/utils/getStyle";

const Dropdown = {
	name: "dropdown",

	directives: {
		Portal
	},

	props: {
		placement: {
			type: String,
			default: undefined
		},
		getPopupContainer: {
			type: Function,
			default: () => document.body
		}
	},

	methods: {
		update(options) {
			if (is.server) {
				return;
			}

			if (this.popup) {
				this.$nextTick(() => {
					this.popup.update();
					this.popup.target.style.minWidth = parseFloat(getStyle(options.reference, "width")) + "px";

					if (options.forceZIndex) {
						this.popup.target.style.zIndex = Popup.nextZIndex();
					}
				});
			}
			else {
				this.$nextTick(() => {
					let reference = options.reference;
					let target = this.$el;
					let settings = {
						placement: this.placement
					};

					if (!reference || !target || !settings.placement) {
						return;
					}

					this.popup = new Popup(reference, target, settings);
					this.popup.target.style.minWidth = parseFloat(getStyle(options.reference, "width")) + "px";

					if (options.forceZIndex) {
						this.popup.target.style.zIndex = Popup.nextZIndex();
					}
				});
			}
		},
		destroy() {
			if (is.server) {
				return;
			}

			if (!this.popup) {
				return;
			}

			this.popup.destroy();
			this.popup = null;
		},
		handleMouseenter(e) {
			this.$emit("mouseenter", e);
		},
		handleMouseleave(e) {
			this.$emit("mouseleave", e);
		}
	},

	beforeDestroy() {
		this.destroy();
	},

	render(h) {
		let { $slots, getPopupContainer, handleMouseenter, handleMouseleave } = this;
		let portal = getPopupContainer();

		return (
			<div v-portal={portal} onMouseenter={handleMouseenter} onMouseleave={handleMouseleave}>
				{$slots.default}
			</div>
		);
	}
};

export default Dropdown;