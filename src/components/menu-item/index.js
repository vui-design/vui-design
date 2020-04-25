import VuiMenuItem from "./src/menu-item";

VuiMenuItem.install = function(Vue) {
	Vue.component(VuiMenuItem.name, VuiMenuItem);
};

export default VuiMenuItem;