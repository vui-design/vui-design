import VuiCollapser from "./src/collapser";

VuiCollapser.install = function(Vue) {
  Vue.component(VuiCollapser.name, VuiCollapser);
};

export default VuiCollapser;