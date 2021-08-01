import VuiWatermark from "./src/watermark";

VuiWatermark.install = function(Vue) {
  Vue.component(VuiWatermark.name, VuiWatermark);
};

export default VuiWatermark;