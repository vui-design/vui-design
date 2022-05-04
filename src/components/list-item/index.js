import VuiListItem from "../list/src/list-item";

VuiListItem.install = function(Vue) {
  Vue.component(VuiListItem.name, VuiListItem);
};

export default VuiListItem;