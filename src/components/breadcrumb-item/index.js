import VuiBreadcrumbItem from "./src/breadcrumb-item";

VuiBreadcrumbItem.install = function(Vue) {
	Vue.component(VuiBreadcrumbItem.name, VuiBreadcrumbItem);
};

export default VuiBreadcrumbItem;