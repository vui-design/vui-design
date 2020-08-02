import fullscreen from "vui-design/utils/fullscreen";
import getClassNamePrefix from "vui-design/utils/getClassNamePrefix";

export default {
	props: {
		classNamePrefix: {
			type: String,
			default: undefined
		},
		value: {
			type: Boolean,
			default: false
		}
	},

	data() {
		let state = {
			status: false
		};

		return {
			state
		};
	},

	watch: {
		value: {
			immediate: true,
			handler(value) {
				let status = fullscreen.getStatus();
				let { request, exit } = this;

				if (value !== status) {
					value ? request() : exit();
				}

				this.state.status = value;
			}
		}
	},

	methods: {
		callback() {
			console.log(fullscreen.getStatus())
			this.state.status = fullscreen.getStatus();

			if (!this.state.status) {
				fullscreen.removeEventListener(this.callback);
			}

			this.$emit("input", this.state.status);
			this.$emit("change", this.state.status);
		},
		request() {
			if (!fullscreen.isSupport() || fullscreen.getStatus()) {
				return;
			}

			let { callback, $el: element } = this;

			fullscreen.addEventListener(callback);
			fullscreen.request(element);
		},
		exit() {
			if (!fullscreen.isSupport() || !fullscreen.getStatus()) {
				return;
			}

			fullscreen.exit();
		},
		handleClick(e) {
			let { $el: element, exit } = this;

			if (e.target === element) {
				exit();
			}
		}
	},

	render() {
		let { $slots: slots, $props: props, state } = this;
		let { handleClick } = this;

		// class
		let classNamePrefix = getClassNamePrefix(props.classNamePrefix, "fullscreen");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true,
			[`${classNamePrefix}-on`]: state.status
		};

		// style
		let styles = {};

		if (state.status) {
			styles.el = {
				width: "100%",
				height: "100%",
				overflowY: "auto"
			};
		}

		// render
		return (
			<div class={classes.el} style={styles.el} onClick={handleClick}>
				{slots.default}
			</div>
		);
	}
};