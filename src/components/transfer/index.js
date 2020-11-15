import VuiTransfer from "./src/transfer";

VuiTransfer.install = function(Vue) {
	Vue.component(VuiTransfer.name, VuiTransfer);
};

export default VuiTransfer;