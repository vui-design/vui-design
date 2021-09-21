import VuiPageHeader from "./src/page-header";

VuiPageHeader.install = function(Vue) {
  Vue.component(VuiPageHeader.name, VuiPageHeader);
};

export default VuiPageHeader;