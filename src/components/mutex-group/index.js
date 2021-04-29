import VuiMutexGroup from "./src/mutex-group";

VuiMutexGroup.install = function(Vue) {
  Vue.component(VuiMutexGroup.name, VuiMutexGroup);
};

export default VuiMutexGroup;