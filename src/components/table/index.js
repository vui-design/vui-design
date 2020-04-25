import VuiTable from "./src/table.js";

VuiTable.install = function(Vue) {
  Vue.component(VuiTable.name, VuiTable);
};

export default VuiTable;