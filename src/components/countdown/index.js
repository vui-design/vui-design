import VuiCountdown from "./src/countdown";

VuiCountdown.install = function(Vue) {
  Vue.component(VuiCountdown.name, VuiCountdown);
};

export default VuiCountdown;