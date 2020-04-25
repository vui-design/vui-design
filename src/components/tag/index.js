import VuiTag from "./src/tag";

VuiTag.install = function(Vue) {
	Vue.component(VuiTag.name, VuiTag);
};

export default VuiTag;