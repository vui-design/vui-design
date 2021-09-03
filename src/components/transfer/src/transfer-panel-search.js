import VuiInput from "../../input";
import Locale from "../../../mixins/locale";
import PropTypes from "../../../utils/prop-types";
import getClassNamePrefix from "../../../utils/getClassNamePrefix";

const VuiTransferPanelSearch = {
	name: "vui-transfer-panel-search",
	components: {
		VuiInput
	},
	mixins: [
		Locale
	],
	props: {
		classNamePrefix: PropTypes.string,
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		placeholder: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
		clearable: PropTypes.bool.def(true),
		disabled: PropTypes.bool.def(false)
	},
	data() {
		const state = {
			value: ""
		};

		return {
			state
		};
	},
	watch: {
		value(value) {
			if (this.state.value === value) {
				return;
			}

			this.state.value = value;
		}
	},
	methods: {
		handleInput(value) {
			this.state.value = value;
			this.$emit("search", value);
		}
	},
	render() {
		const { $props: props, state } = this;
		const  { handleInput } = this;

		// placeholder
		const placeholder = props.placeholder ? props.placeholder : this.t("vui.transfer.search");

		// class
		const classNamePrefix = getClassNamePrefix(props.classNamePrefix, "search");
		let classes = {};

		classes.el = {
			[`${classNamePrefix}`]: true
		};

		// render
		return (
			<div class={classes.el}>
				<VuiInput suffix="search" value={state.value} placeholder={placeholder} clearable={props.clearable} disabled={props.disabled} validator={false} onInput={handleInput} />
			</div>
		);
	}
};

export default VuiTransferPanelSearch;