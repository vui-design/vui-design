import VuiSteps from "./src/steps";

VuiSteps.install = function(Vue) {
	Vue.component(VuiSteps.name, VuiSteps);
};

export default VuiSteps;