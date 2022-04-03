import VuiPopover from "./src/popover";

VuiPopover.install = function(Vue) {
  Vue.component(VuiPopover.name, VuiPopover);
};

export default VuiPopover;