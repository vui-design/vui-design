import VuiHeader from "./src/header";

VuiHeader.install = function(Vue) {
  Vue.component(VuiHeader.name, VuiHeader);
};

export default VuiHeader;