import VuiLayout from "./src/layout";

VuiLayout.install = function(Vue) {
	Vue.component(VuiLayout.name, VuiLayout);
};

export default VuiLayout;