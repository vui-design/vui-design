import VuiBreadcrumbItem from "../breadcrumb/src/breadcrumb-item";

VuiBreadcrumbItem.install = function(Vue) {
  Vue.component(VuiBreadcrumbItem.name, VuiBreadcrumbItem);
};

export default VuiBreadcrumbItem;