import VuiPopconfirm from "./src/popconfirm";

VuiPopconfirm.install = function(Vue) {
	Vue.component(VuiPopconfirm.name, VuiPopconfirm);
};

export default VuiPopconfirm;