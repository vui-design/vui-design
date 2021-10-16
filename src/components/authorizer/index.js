import VuiAuthorizer from "./src/authorizer";

VuiAuthorizer.install = function(Vue) {
  Vue.component(VuiAuthorizer.name, VuiAuthorizer);
};

export default VuiAuthorizer;