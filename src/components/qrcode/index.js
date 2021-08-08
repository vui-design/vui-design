import VuiQrcode from "./src/qrcode";

VuiQrcode.install = function(Vue) {
  Vue.component(VuiQrcode.name, VuiQrcode);
};

export default VuiQrcode;