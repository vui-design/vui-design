import Vue from "vue";
import is from "../../../utils/is";

export const authorizer = (value, authorize) => {
  const vui = Vue.prototype.$vui;
  const callback = authorize || vui.authorize;

  if (!is.function(callback)) {
    return true;
  }

  return callback(value);
};

export default {
  authorizer
};