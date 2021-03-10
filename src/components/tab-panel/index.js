import VuiTabPanel from "./src/tab-panel";

VuiTabPanel.install = function(Vue) {
  Vue.component(VuiTabPanel.name, VuiTabPanel);
};

export default VuiTabPanel;