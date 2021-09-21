import VuiCol from "./src/col";

VuiCol.install = function(Vue) {
  Vue.component(VuiCol.name, VuiCol);
};

export default VuiCol;