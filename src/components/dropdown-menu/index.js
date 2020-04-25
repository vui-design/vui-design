import VuiDropdownMenu from "./src/dropdown-menu";

VuiDropdownMenu.install = function(Vue) {
	Vue.component(VuiDropdownMenu.name, VuiDropdownMenu);
};

export default VuiDropdownMenu;