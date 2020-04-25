import VuiContent from "./src/content";

VuiContent.install = function(Vue) {
	Vue.component(VuiContent.name, VuiContent);
};

export default VuiContent;