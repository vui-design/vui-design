import VuiRibbon from "./src/ribbon";

VuiRibbon.install = function(Vue) {
  Vue.component(VuiRibbon.name, VuiRibbon);
};

export default VuiRibbon;