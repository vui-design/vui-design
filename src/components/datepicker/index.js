import VuiDatepicker from "./src/datepicker";

VuiDatepicker.install = function(Vue) {
	Vue.component(VuiDatepicker.name, VuiDatepicker);
};

export default VuiDatepicker;