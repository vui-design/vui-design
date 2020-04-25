import VuiCardGrid from "../card/src/card-grid";

VuiCardGrid.install = function(Vue) {
	Vue.component(VuiCardGrid.name, VuiCardGrid);
};

export default VuiCardGrid;