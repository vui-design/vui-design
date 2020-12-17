import VuiFormGroup from "../form/src/form-group";

VuiFormGroup.install = function(Vue) {
	Vue.component(VuiFormGroup.name, VuiFormGroup);
};

export default VuiFormGroup;