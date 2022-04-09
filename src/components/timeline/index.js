import VuiTimeline from "./src/timeline";

VuiTimeline.install = function(Vue) {
  Vue.component(VuiTimeline.name, VuiTimeline);
};

export default VuiTimeline;