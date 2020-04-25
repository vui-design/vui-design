import VuiPagination from "./src/pagination";

VuiPagination.install = function(Vue) {
	Vue.component(VuiPagination.name, VuiPagination);
};

export default VuiPagination;