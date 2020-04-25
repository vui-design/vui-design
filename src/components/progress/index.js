import VuiProgress from "./src/progress";

VuiProgress.install = function(Vue) {
	Vue.component(VuiProgress.name, VuiProgress);
};

export default VuiProgress;