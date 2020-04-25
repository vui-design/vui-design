import VuiTable from "./src/table";

VuiTable.install = function(Vue) {
	Vue.component(VuiTable.name, VuiTable);
};

export default VuiTable;