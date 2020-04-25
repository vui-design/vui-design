import VuiForm from "./src/form";

VuiForm.install = function(Vue) {
	Vue.component(VuiForm.name, VuiForm);
};

export default VuiForm;