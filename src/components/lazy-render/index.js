import VuiLazyRender from "./src/lazy-render";

VuiLazyRender.install = function(Vue) {
	Vue.component(VuiLazyRender.name, VuiLazyRender);
};

export default VuiLazyRender;