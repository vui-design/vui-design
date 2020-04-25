import VuiOption from "./src/option";

VuiOption.install = function(Vue) {
	Vue.component(VuiOption.name, VuiOption);
};

export default VuiOption;