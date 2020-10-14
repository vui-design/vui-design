import VuiResizeObserver from "./src/resize-observer";

VuiResizeObserver.install = function(Vue) {
	Vue.component(VuiResizeObserver.name, VuiResizeObserver);
};

export default VuiResizeObserver;