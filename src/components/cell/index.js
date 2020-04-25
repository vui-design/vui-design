import VuiCell from "./src/cell";

VuiCell.install = function(Vue) {
	Vue.component(VuiCell.name, VuiCell);
};

export default VuiCell;