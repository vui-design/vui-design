import VuiSkeleton from "./src/skeleton";

VuiSkeleton.install = function(Vue) {
  Vue.component(VuiSkeleton.name, VuiSkeleton);
};

export default VuiSkeleton;