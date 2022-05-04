import VuiCard from "./src/card";

VuiCard.install = function(Vue) {
  Vue.component(VuiCard.name, VuiCard);
};

export default VuiCard;