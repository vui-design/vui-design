import VuiDropdownButton from "../dropdown/src/dropdown-button";

VuiDropdownButton.install = function(Vue) {
  Vue.component(VuiDropdownButton.name, VuiDropdownButton);
};

export default VuiDropdownButton;