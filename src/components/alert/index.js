import VuiAlert from "./src/alert";

VuiAlert.install = function(Vue) {
	Vue.component(VuiAlert.name, VuiAlert);
};

export default VuiAlert;