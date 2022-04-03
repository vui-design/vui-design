import VuiSkeletonButton from "../skeleton/src/skeleton-button";

VuiSkeletonButton.install = function(Vue) {
  Vue.component(VuiSkeletonButton.name, VuiSkeletonButton);
};

export default VuiSkeletonButton;