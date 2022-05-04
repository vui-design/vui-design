import VuiList from "./src/list";

VuiList.install = function(Vue) {
  Vue.component(VuiList.name, VuiList);
};

export default VuiList;