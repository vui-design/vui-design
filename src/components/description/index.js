import VuiDescription from "../descriptions/src/description";

VuiDescription.install = function(Vue) {
	Vue.component(VuiDescription.name, VuiDescription);
};

export default VuiDescription;