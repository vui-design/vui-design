import VuiBacktop from "./src/backtop";

VuiBacktop.install = function(Vue) {
	Vue.component(VuiBacktop.name, VuiBacktop);
};

export default VuiBacktop;