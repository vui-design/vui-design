import VuiDrawer from "./src/drawer";

VuiDrawer.install = function(Vue) {
  Vue.component(VuiDrawer.name, VuiDrawer);
};

export default VuiDrawer;