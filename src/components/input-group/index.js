import VuiInputGroup from "./src/input-group.vue";

VuiInputGroup.install = function(Vue) {
  Vue.component(VuiInputGroup.name, VuiInputGroup);
};

export default VuiInputGroup;
