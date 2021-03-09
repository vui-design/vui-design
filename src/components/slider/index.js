import VuiSlider from "./src/slider";

VuiSlider.install = function(Vue) {
	Vue.component(VuiSlider.name, VuiSlider);
};

export default VuiSlider;