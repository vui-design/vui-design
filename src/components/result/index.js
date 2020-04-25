import VuiResult from "./src/result";

VuiResult.install = function(Vue) {
	Vue.component(VuiResult.name, VuiResult);
};

export default VuiResult;
