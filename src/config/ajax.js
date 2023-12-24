import axios from "axios";
import { Notification } from "element-ui";
import router from "../router";
import store from "../store";
// import 'element-ui/lib/theme-chalk/index.css'
import "../../theme/index.css";
import { handleResponseTime } from '../utils/timeHandle'

import { lang } from "../i18n";

const axiosIns = axios.create();
// axiosIns.defaults.retry = 1
// axiosIns.defaults.retryDelay = 1000
axiosIns.defaults.timeout = 60000;

console.log("process.env", process.env);
const baseURL = process.env.NODE_ENV === "development" ? '/apis' : location.protocol + '//' + location.hostname
axiosIns.defaults.baseURL = baseURL
// if (process.env.NODE_ENV === "development") {
//   axiosIns.defaults.baseURL = "/apis";
// } else {
//   axiosIns.defaults.baseURL = location.protocol + "//" + location.hostname;
// }
/* axiosIns.defaults.baseURL = location.protocol + "//" + location.hostname; */
// lang(添加请求拦截器)
axiosIns.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded', http://admin.wy24.com
    const token = window.localStorage.getItem("token");
    const siteCode = window.localStorage.getItem("SToken");
    const language = window.localStorage.getItem("lang");
    // 把token放到参数里面
    // if (token && config.params) {
    //   config.params.token = token
    // } else {
    //   config.params = { 'token': token }
    // }
    // 把token放到header里面
    config.headers["language"] = language;
    if (token) {
      config.headers["token"] = token;
    }
    if (siteCode) {
      config.headers["SToken"] = siteCode;
    }
    return config;
  },
  function(error) {
    // 对请求错误做些什么
    console.log("错误的传参");
    return Promise.reject(error);
  }
);

axiosIns.interceptors.response.use(
  res => {
    if (res && res.data && store.state.timeZone !== 0) {
      res.data = handleResponseTime(res.config.url, res.data)
    }
    if (res.config.url.indexOf('/apis/bkapi/member/mbraccount/list') !== -1) {
      console.log('99999-res', res.data.page.list[0].registerTime)
    }
    // 对响应数据做些事
    if (!res.data) {
      return Promise.reject(res);
    }
    return res;
  },
  error => {
    // 请求错误时做些事
    // 请求超时的之后，抛出 error.code = ECONNABORTED的错误..错误信息是 timeout of  xxx ms exceeded
    // if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    //   var config = error.config
    //   config.__retryCount = config.__retryCount || 0
    //   if (config.__retryCount >= config.retry) {
    //     // Reject with the error
    //     // window.location.reload()
    //     return Promise.reject(error)
    //   }
    //   // Increase the retry count
    //   config.__retryCount += 1
    //   // Create new promise to handle exponential backoff
    //   var backoff = new Promise(function (resolve) {
    //     setTimeout(function () {
    //       // console.log('resolve')
    //       resolve()
    //     }, config.retryDelay || 1)
    //   })
    //   return backoff.then(function () {
    //     return axiosIns(config)
    //   })
    // } else {
    return Promise.reject(error);
    // }
  }
);
const ajaxMethod = ["get", "post"];

const setT = url => `${url}${/\?/.test(url)? '&' : '?'}_t=${+new Date()}`

const tips = message => {
  Notification({
    title: lang("温馨提示"),
    message,
    position: "top-right"
  })
}

const dealResponse = (response) => {
  const { code, msg, data } = response.data
  store.state.searchLoading = false
  store.state.fullscreenLoading = false
  if (code === 500) {
    tips(msg)
  } else if (code === 2000) {
    tips(msg)
  } else if (code === 2001) {
    tips(lang('没有权限') + '！')
    // 没有权限
  } else if (code === 401 && msg === 'securityError') { //敏感操作 安全码校验失败 后端目前只能返回401  特殊处理下
    tips(lang('安全密码错误') + '！')
  } else if (code === 401) {
    if (store.state.badNetNum > 1) {
      tips(lang('登录信息失效，请重新登陆'))
      store.state.badNetNum = 1
    }
    router.replace("/login")
  } else if (code === 0 || code===604) {
    return true
  } else if (code === 402) {
    store.state.resetPassShow = true
    store.commit("setUser", data)
  }
  return false
}

const dealError = error => {
  store.state.searchLoading = false;
  store.state.fullscreenLoading = false;
  if (error.response) {
    // 请求已发出，但服务器响应的状态码不在 2xx 范围内
    // console.log(error.response.data)
    // console.log(error.response.status)
    // console.log(error.response.headers)
  } else {
    if (store.state.badNetNum > 1) {
      tips(lang('网络故障'))
      store.state.badNetNum = 1;
    }
    // console.log(error)
    // Something happened in setting up the request that triggered an Error
    // console.log('Error', error.message)
  }
}

const api = {};
ajaxMethod.forEach(method => {
  api[method] = function(uri, data, config = {}) {
    uri = setT(uri)
    let _async_, sendData;
    if (data && data._async_) {
      const { _async_: async, ..._data } = data;
      _async_ = async;
      if (method === 'get') {
        sendData = { params: _data };
      }
      if (method === 'post') {
        delete data._async_;
      }
    }
    let promise = new Promise(function(resolve, reject) {
      axiosIns[method](uri, sendData || data, config)
        .then(response => {
          dealResponse(response) ? resolve(response) : reject(response)
        })
        .catch(function(error) {
          dealError(error)
          reject(error)
          // console.log(error.config)
        });
    });
    if (_async_) {
      promise = promise.then(res => [res.data, null, res], err => [null, err]);
    }
    return promise;
  };
});

const Request = method => {
  return (url, data, config = {}) => {
    url = setT(url)
    const _config = {
      ...config
    }
    const dataReturn = (res, err, response) => ({ res, err, response })
    return axiosIns[method](url, method === 'get' ? { params: data } : data, _config).then(res => {
      return dealResponse(res) ? dataReturn(res.data, null, res) : dataReturn(null, res, res)
    }, err => {
      dealError(err)
      return dataReturn(null, err, err)
    })
  }
}

api.GET = Request('get')
api.POST = Request('post')
api.$baseURL = baseURL

export default api;
