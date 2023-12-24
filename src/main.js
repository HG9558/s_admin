// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";


import i18n, { lang } from "./i18n";

import './utils/index'
import promiseFinally from 'promise.prototype.finally';
promiseFinally.shim();

// import Mixin from '@/mixins/loadTime'
// Vue.mixin(Mixin)

/* import  scrollToBottom  from './assets/js/scrollTop'
Vue.prototype.$scrToBottom = scrollToBottom */
Vue.prototype.$t = lang
window.vm = new Vue({
  el: "#app",
  router,
  store,
  i18n,
  template: "<App/>",
  components: { App }
});
