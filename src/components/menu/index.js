import VuiMenu from "./src/menu";

VuiMenu.install = function(Vue) {
	Vue.component(VuiMenu.name, VuiMenu);
};

export default VuiMenu;