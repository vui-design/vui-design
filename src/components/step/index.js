import VuiStep from "../steps/src/step";

VuiStep.install = function(Vue) {
	Vue.component(VuiStep.name, VuiStep);
};

export default VuiStep;