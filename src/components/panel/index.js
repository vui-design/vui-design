import VuiPanel from "./src/panel";

VuiPanel.install = function(Vue) {
	Vue.component(VuiPanel.name, VuiPanel);
};

export default VuiPanel;