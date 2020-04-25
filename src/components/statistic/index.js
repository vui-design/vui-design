import VuiStatistic from "./src/statistic";

VuiStatistic.install = function(Vue) {
	Vue.component(VuiStatistic.name, VuiStatistic);
};

export default VuiStatistic;