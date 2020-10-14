import PropTypes from "vui-design/utils/prop-types";

const VuiLazyRender = {
	name: "vui-lazy-render",
	props: {
		status: PropTypes.bool.def(false)
	},
	data() {
		const state = {
			status: this.status
		};

		return {
			state
		};
	},
	watch: {
		status(value) {
			if (!value || this.state.status) {
				return;
			}

			this.state.status = true;
		}
	},
	render() {
		if (!this.state.status) {
			return null;
		}

		return this.$slots.default;
	}
};

export default VuiLazyRender;