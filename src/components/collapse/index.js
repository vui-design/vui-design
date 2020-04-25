import VuiCollapse from "./src/collapse";

VuiCollapse.install = function(Vue) {
	Vue.component(VuiCollapse.name, VuiCollapse);
};

export default VuiCollapse;