import VuiBadge from "./src/badge";

VuiBadge.install = function(Vue) {
	Vue.component(VuiBadge.name, VuiBadge);
};

export default VuiBadge;
