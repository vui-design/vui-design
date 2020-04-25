import VuiMenuItemGroup from "./src/menu-item-group";

VuiMenuItemGroup.install = function(Vue) {
	Vue.component(VuiMenuItemGroup.name, VuiMenuItemGroup);
};

export default VuiMenuItemGroup;