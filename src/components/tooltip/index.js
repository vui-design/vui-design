import VuiTooltip from "./src/tooltip";

VuiTooltip.install = function(Vue) {
	Vue.component(VuiTooltip.name, VuiTooltip);
};

export default VuiTooltip;