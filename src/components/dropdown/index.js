import VuiDropdown from "./src/dropdown";

VuiDropdown.install = function(Vue) {
  Vue.component(VuiDropdown.name, VuiDropdown);
};

export default VuiDropdown;