import VuiButton from "./src/button";

VuiButton.install = function(Vue) {
  Vue.component(VuiButton.name, VuiButton);
};

export default VuiButton;