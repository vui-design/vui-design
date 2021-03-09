import VuiOptionGroup from "./src/option-group";

VuiOptionGroup.install = function(Vue) {
  Vue.component(VuiOptionGroup.name, VuiOptionGroup);
};

export default VuiOptionGroup;