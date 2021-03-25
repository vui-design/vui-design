import VuiFormItem from "../form/src/form-item";

VuiFormItem.install = function(Vue) {
  Vue.component(VuiFormItem.name, VuiFormItem);
};

export default VuiFormItem;