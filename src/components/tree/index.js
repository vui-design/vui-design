import VuiTree from "./src/tree";

VuiTree.install = function(Vue) {
	Vue.component(VuiTree.name, VuiTree);
};

export default VuiTree;