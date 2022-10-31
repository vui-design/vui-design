import Vue from "vue";
import VueRouter from "vue-router";
import VuiDesign from "../src/index";
import App from "./App.vue";
import locale from "../src/locale/lang/zh-CN";

Vue.use(VueRouter);
Vue.use(VuiDesign, {
  locale
});

// 开启 debug 模式
Vue.config.debug = true;

// 路由配置
const router = new VueRouter({
  esModule: false,
  mode: 'history',
  routes: [
    {
      path: "/icon",
      component: resolve => require(["./routers/icon.vue"], resolve)
    },
    {
      path: "/button",
      component: resolve => require(["./routers/button.vue"], resolve)
    },
    {
      path: "/link",
      component: resolve => require(["./routers/link.vue"], resolve)
    }
  ]
});

// 
const app = new Vue({
  el: "#app",
  router,
  render: h => h(App)
});