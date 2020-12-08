import VuiTimeroutine from "./src/timeroutine";

VuiTimeroutine.install = function(Vue) {
	Vue.component(VuiTimeroutine.name, VuiTimeroutine);
};

export default VuiTimeroutine;