import VuiUpload from "./src/upload";

VuiUpload.install = function(Vue) {
	Vue.component(VuiUpload.name, VuiUpload);
};

export default VuiUpload;