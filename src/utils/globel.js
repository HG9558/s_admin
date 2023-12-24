import Vue from "vue";
import api from "../config/ajax";
Vue.prototype.$axios = api;

import systemConfig from "../config/config";
Vue.prototype.$systemConfig = systemConfig;
Vue.prototype.$urls = systemConfig.urls;
