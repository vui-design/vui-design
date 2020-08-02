import VuiFullscreen from "./src/fullscreen";

VuiFullscreen.install = function(Vue) {
	Vue.component(VuiFullscreen.name, VuiFullscreen);
};

export default VuiFullscreen;